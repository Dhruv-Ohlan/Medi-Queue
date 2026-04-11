const Token = require("../models/Token");
const Department = require("../models/Department");
const { TOKEN_STATUSES, URGENCY_LEVELS } = require("../config/constants");

const { sortTokensByPriority } = require("../utils/queueSort");
const { calculateETA } = require("../utils/eta");
const { getDayKey, getStartOfDay, getEndOfDay } = require("../utils/dateBuckets");
const Patient = require("../models/Patient");
const SymptomResponse = require("../models/SymptomResponse");
const notificationService = require("./notification.service");


const getPatientQueueStatus = async (trackingId) => {
  // 1. Find the patient's token
  const token = await Token.findOne({ trackingId }).populate("departmentId");
  if (!token) {
    const error = new Error("Tracking details not found for the provided ID");
    error.status = 404;
    throw error;
  }


  // If token is already completed or skipped, return status without position
  if ([TOKEN_STATUSES.COMPLETED, TOKEN_STATUSES.SKIPPED].includes(token.status)) {
    return {
      tokenNumber: token.tokenNumber,
      department: token.departmentId?.name || "N/A",
      urgencyLevel: token.urgencyLevel,

      status: token.status,
      currentServingToken: null,
      queuePosition: 0,
      etaMinutes: 0
    };
  }

  // 2. Get all active tokens for this department today
  // Statuses: Waiting, Called
  const dayKey = getDayKey(new Date());
  const activeTokens = await Token.find({
    departmentId: token.departmentId._id,
    dayKey,
    status: { $in: [TOKEN_STATUSES.WAITING, TOKEN_STATUSES.CALLED] }
  });

  // 3. Identify currently serving token(s)
  const currentCalledTokens = activeTokens.filter(t => t.status === TOKEN_STATUSES.CALLED);
  const currentServingToken = currentCalledTokens.length > 0 
    ? currentCalledTokens[0].tokenNumber 
    : (activeTokens.length > 0 ? "None" : "N/A");

  // 4. Sort the "Waiting" queue to find position
  // Note: Tokens already "CALLED" are arguably ahead of those "WAITING"
  const waitingTokens = activeTokens.filter(t => t.status === TOKEN_STATUSES.WAITING);
  const sortedWaiting = sortTokensByPriority(waitingTokens);

  // Find position in the waiting list
  // If the user's token is already CALLED, position is 0
  let queuePosition = 0;
  if (token.status === TOKEN_STATUSES.WAITING) {
    const index = sortedWaiting.findIndex(t => t._id.toString() === token._id.toString());
    queuePosition = index + 1; // 1-based position
  }

  // 5. Calculate ETA
  // We add the number of CALLED tokens too? 
  // If you are position 1 in waiting, and 1 token is being called, you are actually 2nd in line to see the doctor.
  const totalPeopleAhead = queuePosition + currentCalledTokens.length;
  // If the patient is CALLED, they are position 0 (being served)
  const effectivePosition = token.status === TOKEN_STATUSES.CALLED ? 0 : totalPeopleAhead;

  const etaMinutes = calculateETA(effectivePosition);

  return {
    tokenNumber: token.tokenNumber,
    department: token.departmentId?.name || "N/A",
    urgencyLevel: token.urgencyLevel,

    status: token.status,
    currentServingToken: currentCalledTokens.length > 0 ? currentCalledTokens.map(t => t.tokenNumber).join(", ") : "None",
    queuePosition: effectivePosition,
    etaMinutes: token.status === TOKEN_STATUSES.CALLED ? 0 : etaMinutes
  };
};

const getDepartmentQueue = async (departmentId) => {
  const dayKey = getDayKey(new Date());
  
  // 1. Fetch all tokens for today
  const tokens = await Token.find({ departmentId, dayKey })
    .populate("patientId")
    .lean();

  // 2. Filter into status buckets
  const waiting = tokens.filter(t => t.status === TOKEN_STATUSES.WAITING);
  const called = tokens.filter(t => t.status === TOKEN_STATUSES.CALLED);
  const completed = tokens.filter(t => t.status === TOKEN_STATUSES.COMPLETED);

  // 3. Sort waiting tokens by urgency
  const sortedWaiting = sortTokensByPriority(waiting);

  // 4. Map to doctor-friendly format
  const formatToken = (t) => ({
    id: t._id,
    tokenNumber: t.tokenNumber,
    patientName: t.patientId?.name || "Anonymous",
    age: t.patientId?.age,
    gender: t.patientId?.gender,
    urgencyLevel: t.urgencyLevel,
    aiReasoning: t.aiReasoning,
    status: t.status,
    registeredAt: t.registeredAt,
    waitTime: Math.floor((new Date() - new Date(t.registeredAt)) / 60000), // mins
  });

  // 5. Calculate Stats
  const avgConsultTime = completed.length > 0
    ? Math.floor(
        completed.reduce((acc, t) => acc + (new Date(t.completedAt) - new Date(t.calledAt)), 0) / 
        (completed.length * 60000)
      )
    : 12; // fallback to 12 mins

  const startOfDay = getStartOfDay();
  const hoursPassed = Math.max(1, (new Date() - startOfDay) / 3600000);
  const throughput = Math.round(completed.length / hoursPassed);

  // 6. Detect Active Unacknowledged Emergency for Alert Modal
  let emergencyAlert = null;
  const activeEmergency = sortedWaiting.find(t => 
    t.urgencyLevel === URGENCY_LEVELS.EMERGENCY && !t.emergencyAcknowledged
  );

  if (activeEmergency) {
    const symptoms = await SymptomResponse.findOne({ tokenId: activeEmergency._id });
    emergencyAlert = {
      id: activeEmergency._id,
      tokenNumber: activeEmergency.tokenNumber,
      patientName: activeEmergency.patientId?.name || "Anonymous",
      aiReasoning: activeEmergency.aiReasoning,
      symptoms: symptoms?.responses?.symptoms || "Check details in queue",
      urgencyLevel: activeEmergency.urgencyLevel,
    };
  }

  return {
    activeQueue: [
      ...called.map(formatToken),
      ...sortedWaiting.map(formatToken)
    ],
    emergencyAlert,
    stats: {
      waitingCount: waiting.length,
      completedCount: completed.length,
      avgConsultTimeMinutes: avgConsultTime,
      throughputPerHour: throughput,
      loadIndicator: waiting.length > 10 ? "high" : (waiting.length > 5 ? "medium" : "low"),
    }
  };
};

const acknowledgeEmergency = async (tokenId) => {
  const token = await Token.findById(tokenId);
  if (!token) throw new Error("Token not found");
  
  token.emergencyAcknowledged = true;
  await token.save();
  
  return token;
};


const callToken = async (tokenId, doctorId) => {
  const token = await Token.findById(tokenId).populate("patientId").populate("departmentId");
  if (!token) throw new Error("Token not found");
  
  token.status = TOKEN_STATUSES.CALLED;
  token.calledAt = new Date();
  token.calledById = doctorId;
  await token.save();

  // 1. Trigger "Token Called" SMS (non-blocking)
  notificationService.sendTokenCalledSms(token, token.patientId)
    .catch(err => console.error("Token called notification failed", err));

  // 2. Check for patients who are now "Almost Up" (non-blocking)
  checkAndNotifyAlmostUp(token.departmentId._id)
    .catch(err => console.error("Almost-up check failed", err));
  
  return token;
};

const checkAndNotifyAlmostUp = async (departmentId) => {
  const dayKey = getDayKey(new Date());
  
  // Get all waiting tokens to determine correct sequence
  const allWaiting = await Token.find({
    departmentId,
    dayKey,
    status: TOKEN_STATUSES.WAITING
  }).populate("patientId").populate("departmentId");

  if (allWaiting.length === 0) return;

  // Sort by the same priority logic used in the queue display
  const sortedWaiting = sortTokensByPriority(allWaiting);

  // Notify patients in positions 1 to 5
  // We can notify all of them, the service handles the 'already sent' check via DB flags
  const topFive = sortedWaiting.slice(0, 5);
  
  for (const t of topFive) {
    if (!t.notifiedAlmostUp) {
      notificationService.sendAlmostUpSms(t, t.patientId)
        .catch(err => console.error(`Failed to send almost-up to token ${t.tokenNumber}`, err));
    }
  }
};


const completeToken = async (tokenId) => {
  const token = await Token.findById(tokenId);
  if (!token) throw new Error("Token not found");
  
  token.status = TOKEN_STATUSES.COMPLETED;
  token.completedAt = new Date();
  await token.save();
  
  return token;
};

const skipToken = async (tokenId) => {
  const token = await Token.findById(tokenId);
  if (!token) throw new Error("Token not found");
  
  // Set to waiting but move to end of its urgency group
  token.status = TOKEN_STATUSES.WAITING;
  token.skipCount = (token.skipCount || 0) + 1;
  token.registeredAt = new Date(); // Resetting registeredAt moves them to bottom of bucket in current sorting logic
  await token.save();

  // Trigger almost-up check (non-blocking) as queue has shifted
  checkAndNotifyAlmostUp(token.departmentId)
    .catch(err => console.error("Almost-up check failed in skipToken", err));

  return token;
};

module.exports = {
  getPatientQueueStatus,
  getDepartmentQueue,
  acknowledgeEmergency,
  callToken,
  completeToken,
  skipToken,
};
