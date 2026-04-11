const Token = require("../models/Token");
const Patient = require("../models/Patient");
const Department = require("../models/Department");
const SymptomResponse = require("../models/SymptomResponse");
const { runTriage } = require("./triage.service");
const { calculateETA } = require("../utils/eta");
const { v4: uuidv4 } = require("uuid");
const { TOKEN_STATUSES } = require("../config/constants");
const notificationService = require("./notification.service");


const getDayKey = () => new Date().toISOString().slice(0, 10);

const registerPatient = async (patientData) => {
  // 1. Create or Find Patient
  let patient = await Patient.findOne({ phoneNumber: patientData.phoneNumber });
  if (!patient) {
    patient = await Patient.create({
      name: patientData.name,
      age: patientData.age,
      gender: patientData.gender,
      phoneNumber: patientData.phoneNumber,
      // Leaving phoneHash/phoneMasked out for MVP simplicity as per request
    });
  }

  // 2. Run AI Triage
  const triageResult = await runTriage(patientData);

  // 3. Map to Department
  let department = await Department.findOne({ name: triageResult.department });
  
  // Hardening: If AI suggests a department that isn't seeded, fallback to General Medicine
  if (!department) {
    console.warn(`[Hardening] Department '${triageResult.department}' not found. Falling back to General Medicine.`);
    department = await Department.findOne({ name: "General Medicine" });
  }

  if (!department) {
    throw new Error(`Critical Error: Department '${triageResult.department}' and fallback 'General Medicine' not found. Ensure DB is seeded.`);
  }


  // 4. Generate token number for the day
  const dayKey = getDayKey();
  const lastToken = await Token.findOne({ departmentId: department._id, dayKey })
    .sort({ tokenNumber: -1 });
  
  const nextTokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

  // 5. Generate tracking ID and Create Token
  const trackingId = uuidv4();
  const token = await Token.create({
    patientId: patient._id,
    departmentId: department._id,
    tokenNumber: nextTokenNumber,
    trackingId,
    urgencyLevel: triageResult.urgency,
    dayKey,
    aiReasoning: triageResult.reasoning,
    status: TOKEN_STATUSES.WAITING,
  });

  // 6. Create Symptom Response with correctly packed 'responses' object
  await SymptomResponse.create({
    tokenId: token._id,
    responses: {
      symptoms: patientData.symptoms,
      painLevel: patientData.painLevel,
      fever: patientData.fever,
      duration: patientData.duration,
      conditions: patientData.conditions,
    },
  });

  // Calculate generic ETA based on queue length (MVP style)
  const queueLength = await Token.countDocuments({
    departmentId: department._id,
    dayKey,
    status: TOKEN_STATUSES.WAITING,
  });
  
  const estimatedWaitMs = calculateETA(queueLength, 15); // 15 mins per patient
  const estimatedWaitMinutes = queueLength * 15;
  
  // Trigger notification (non-blocking)
  notificationService.sendRegistrationSms(token, patient, department.name, estimatedWaitMinutes)
    .catch(err => console.error("Registration notification failed", err));

  return {
    trackingId: token.trackingId,
    tokenNumber: token.tokenNumber,
    department: department.name,
    urgencyLevel: token.urgencyLevel,
    aiReasoning: token.aiReasoning,
    estimatedWaitMinutes,
    status: token.status,
  };
};

module.exports = {
  registerPatient,
};
