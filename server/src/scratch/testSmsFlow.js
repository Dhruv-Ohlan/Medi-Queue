const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectDB } = require('../config/db');
const tokenService = require('../services/token.service');
const queueService = require('../services/queue.service');
const Token = require('../models/Token');
const Patient = require('../models/Patient');
const Department = require('../models/Department');

dotenv.config();

const runTest = async () => {
    try {
        await connectDB();
        console.log("Connected to DB...");

        // 1. Setup - Find a department
        const dept = await Department.findOne({ name: "General Medicine" });
        if (!dept) throw new Error("Seed the departments first!");

        // 2. Clear existing tokens for today to have a clean start
        const dayKey = new Date().toISOString().slice(0, 10);
        await Token.deleteMany({ dayKey });
        console.log("Cleared today's tokens for clean test.");

        // 3. Test Registration SMS
        console.log("\n--- Testing Registration SMS ---");
        const registrationResult = await tokenService.registerPatient({
            name: "John Doe",
            age: 30,
            gender: "male",
            phoneNumber: "+919876543210", // Example format
            symptoms: "Fever and cough",
            painLevel: 5,
            fever: "Yes",
            duration: "2 days",
            conditions: "None"
        });
        console.log("Registered Patient. Tracking ID:", registrationResult.trackingId);

        // 4. Add 5 more patients to the queue (total 6)
        console.log("\n--- Adding 5 more patients to shift queue ---");
        for (let i = 1; i <= 5; i++) {
            await tokenService.registerPatient({
                name: `Patient ${i}`,
                age: 20 + i,
                gender: i % 2 === 0 ? "female" : "male",
                phoneNumber: `+91111111110${i}`,
                symptoms: "Checkup",
                painLevel: 1,
                fever: "No",
                duration: "1 day",
                conditions: "None"
            });
        }

        // Now Total: 6 patients. John Doe is at Pos 1. Patient 5 is at Pos 6 (not "Almost Up").
        
        // 5. Check "Almost Up" status for Patient 5
        console.log("\n--- Checking 'Almost Up' trigger ---");
        const johnToken = await Token.findOne({ trackingId: registrationResult.trackingId });
        const doctorId = new mongoose.Types.ObjectId(); // Mock doctor ID
        
        console.log("Doctor calling John Doe...");
        await queueService.callToken(johnToken._id, doctorId);
        
        // When John is called, Patient 5 (originally Pos 6) becomes Pos 5. 
        // The callToken flow should trigger checkAndNotifyAlmostUp.
        
        // Wait a small bit for async notifications to log
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 6. Verify flags in DB
        const patient5Token = await Token.findOne({ name: "Patient 5" }).populate('patientId'); // Wait, Token doesn't have name, it's in Patient.
        // Actually I'll just check all tokens today.
        const tokens = await Token.find({ dayKey }).populate('patientId');
        
        console.log("\n--- Database Notification Flag Status ---");
        tokens.forEach(t => {
            console.log(`Token ${t.tokenNumber} (${t.patientId.name}): 
  Registration SMS: ${t.notifiedRegistration}
  Almost-Up SMS: ${t.notifiedAlmostUp}
  Called SMS: ${t.notifiedCalled}`);
        });

        console.log("\nTest Completed successfully.");
        process.exit(0);

    } catch (error) {
        console.error("Test Failed:", error);
        process.exit(1);
    }
};

runTest();
