const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env
dotenv.config({ path: path.join(__dirname, "../../.env") });

const Hospital = require("../models/Hospital");
const Department = require("../models/Department");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Token = require("../models/Token");
const queueService = require("../services/queue.service");
const { URGENCY_LEVELS, TOKEN_STATUSES, ROLES } = require("../config/constants");
const { getDayKey } = require("../utils/dateBuckets");

const runTest = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected.");

    // 1. Cleanup
    console.log("Cleaning up test data...");
    const testHospitalName = "Test General Hospital";
    const hospital = await Hospital.findOneAndUpdate(
      { name: testHospitalName },
      { name: testHospitalName, address: "Test Road 123" },
      { upsert: true, new: true }
    );

    const department = await Department.findOneAndUpdate(
      { name: "Test Paediatrics", hospitalId: hospital._id },
      { name: "Test Paediatrics", hospitalId: hospital._id },
      { upsert: true, new: true }
    );

    const doctor = await User.findOneAndUpdate(
      { email: "test-doctor@mediqueue.com" },
      { 
        name: "Dr. Tester", 
        email: "test-doctor@mediqueue.com", 
        role: ROLES.DOCTOR, 
        departmentId: department._id,
        passwordHash: "dummyhash"
      },
      { upsert: true, new: true }
    );

    // Delete existing tokens for this dept today to have a clean slate
    const dayKey = getDayKey(new Date());
    await Token.deleteMany({ departmentId: department._id, dayKey });

    // 2. Create Patients & Tokens
    console.log("Creating test tokens...");
    const patientsData = [
      { name: "Patient A (Routine)", age: 30, phone: "123" },
      { name: "Patient B (Emergency)", age: 25, phone: "456" },
      { name: "Patient C (Priority)", age: 40, phone: "789" },
    ];

    const tokens = [];
    for (let i = 0; i < patientsData.length; i++) {
        const p = await Patient.create({ name: patientsData[i].name, age: patientsData[i].age, phoneNumber: patientsData[i].phone });
        const urgencies = [URGENCY_LEVELS.ROUTINE, URGENCY_LEVELS.EMERGENCY, URGENCY_LEVELS.PRIORITY];
        const t = await Token.create({
            patientId: p._id,
            departmentId: department._id,
            tokenNumber: 100 + i,
            trackingId: `TEST-${Date.now()}-${i}`,
            urgencyLevel: urgencies[i],
            status: TOKEN_STATUSES.WAITING,
            dayKey,
            aiReasoning: `Reason for ${patientsData[i].name}`
        });
        tokens.push(t);
    }

    // 3. Test Queue Retrieval
    console.log("\n--- Testing GET QUEUE ---");
    let queueData = await queueService.getDepartmentQueue(department._id);
    console.log("Sorted Queue (should be Emergency first, then Priority, then Routine):");
    queueData.activeQueue.forEach((t, i) => {
        console.log(`${i+1}. Token ${t.tokenNumber} - ${t.urgencyLevel} - ${t.patientName}`);
    });
    console.log("Stats:", JSON.stringify(queueData.stats, null, 2));

    // 4. Test CALL
    console.log("\n--- Testing CALL (Emergency Token) ---");
    const emergencyToken = tokens[1]; // Patient B
    await queueService.callToken(emergencyToken._id, doctor._id);
    console.log(`Called Token ${emergencyToken.tokenNumber}`);

    queueData = await queueService.getDepartmentQueue(department._id);
    console.log("Queue after selection (Called should be at top):");
    queueData.activeQueue.forEach((t, i) => {
        console.log(`${i+1}. Token ${t.tokenNumber} - ${t.urgencyLevel} - ${t.status}`);
    });

    // 5. Test SKIP (Routine Patient)
    console.log("\n--- Testing SKIP (Routine Token) ---");
    const routineToken = tokens[0]; // Patient A
    await queueService.skipToken(routineToken._id);
    console.log(`Skipped Token ${routineToken.tokenNumber}`);
    
    // We need to wait a tiny bit or force a sequence? registeredAt reset to `now`
    // If I skip A, A should definitely be at the bottom since B is called, C is priority, and A is routine.
    // Let's create another Routine to see if A moves below it.
    console.log("Creating another Routine Token to test skip position...");
    const pD = await Patient.create({ name: "Patient D (New Routine)", age: 20, phoneNumber: "000" });
    await Token.create({
        patientId: pD._id,
        departmentId: department._id,
        tokenNumber: 110,
        trackingId: `TEST-NEW-${Date.now()}`,
        urgencyLevel: URGENCY_LEVELS.ROUTINE,
        status: TOKEN_STATUSES.WAITING,
        dayKey,
        registeredAt: new Date(Date.now() - 10000) // 10 seconds ago
    });

    queueData = await queueService.getDepartmentQueue(department._id);
    console.log("Queue after skipping A and adding New Routine (A should be last):");
    queueData.activeQueue.forEach((t, i) => {
        console.log(`${i+1}. Token ${t.tokenNumber} - ${t.urgencyLevel} - ${t.status} - ${t.patientName}`);
    });

    // 6. Test COMPLETE
    console.log("\n--- Testing COMPLETE ---");
    await queueService.completeToken(emergencyToken._id);
    console.log(`Completed Token ${emergencyToken.tokenNumber}`);

    queueData = await queueService.getDepartmentQueue(department._id);
    console.log("Stats after completion:", JSON.stringify(queueData.stats, null, 2));

    console.log("\nTests passed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
};

runTest();
