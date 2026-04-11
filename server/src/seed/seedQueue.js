const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const { connectDB } = require('../config/db');
const Department = require('../models/Department');
const Patient = require('../models/Patient');
const Token = require('../models/Token');
const { URGENCY_LEVELS, TOKEN_STATUSES } = require('../config/constants');

dotenv.config();

const seedQueue = async () => {
  await connectDB();

  try {
    // 1. Get departments
    const departments = await Department.find();
    if (departments.length === 0) {
      console.log("No departments found. Please run seedDepartments.js first.");
      process.exit(1);
    }
    
    // Clear today's tokens to avoid duplicates in demo prep
    const dayKey = new Date().toISOString().slice(0, 10);
    await Token.deleteMany({ dayKey });

    console.log(`Seeding demo queue data for ${dayKey}...`);

    let tokenCounter = 1;
    let tokensToInsert = [];
    let patientsToInsert = [];

    const names = ["Aarav Patel", "Riya Singh", "Vikram Sharma", "Neha Gupta", "Aditya Joshi", "Kriti Verma", "Sanjay Kumar", "Pooja Reddy", "Karan Malhotra", "Anjali Desai", "Rohan Mehta", "Tara Iyer", "Kavya Menon", "Aman Jain", "Ishaan Roy"];

    for (let i = 0; i < names.length; i++) {
        patientsToInsert.push({
            name: names[i],
            age: Math.floor(Math.random() * 50) + 10,
            gender: Math.random() > 0.5 ? "Male" : "Female",
            phoneNumber: `+9198000000${i < 10 ? '0'+i : i}`,
        });
    }
    await Patient.insertMany(patientsToInsert);
    const createdPatients = await Patient.find();

    const now = new Date();
    
    // Create completed/historical tokens (past 2 hours)
    for (let i = 0; i < 10; i++) {
        const dept = departments[Math.floor(Math.random() * departments.length)];
        const pt = createdPatients[i];
        
        // Random time between 2 hours ago and 30 mins ago
        const regTime = new Date(now.getTime() - (Math.random() * 90 + 30) * 60000); 
        const callTime = new Date(regTime.getTime() + (Math.random() * 15 + 5) * 60000); // 5-20 mins later
        const consultTime = new Date(callTime.getTime() + 1 * 60000); // 1 min later
        const compTime = new Date(consultTime.getTime() + (Math.random() * 10 + 5) * 60000); // 5-15 mins later

        tokensToInsert.push({
            patientId: pt._id,
            departmentId: dept._id,
            tokenNumber: tokenCounter++,
            trackingId: uuidv4(),
            urgencyLevel: URGENCY_LEVELS.ROUTINE,
            aiReasoning: "Routine checkup based on regular symptoms.",
            status: TOKEN_STATUSES.COMPLETED,
            registeredAt: regTime,
            calledAt: callTime,
            consultStartedAt: consultTime,
            completedAt: compTime,
            dayKey
        });
    }

    // Create waiting tokens
    for (let i = 10; i < 15; i++) {
        const dept = departments[Math.floor(Math.random() * departments.length)];
        const pt = createdPatients[i];
        
        // Random waiting time 5 to 25 mins ago
        const regTime = new Date(now.getTime() - (Math.random() * 20 + 5) * 60000); 

        tokensToInsert.push({
            patientId: pt._id,
            departmentId: dept._id,
            tokenNumber: tokenCounter++,
            trackingId: uuidv4(),
            urgencyLevel: i === 12 ? URGENCY_LEVELS.PRIORITY : URGENCY_LEVELS.ROUTINE,
            aiReasoning: i === 12 ? "Fever exceeds threshold." : "Minor discomfort reported.",
            status: TOKEN_STATUSES.WAITING,
            registeredAt: regTime,
            dayKey
        });
    }

    await Token.insertMany(tokensToInsert);
    console.log("Queue seeded successfully with historical and active patients!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding queue:", error);
    process.exit(1);
  }
};

seedQueue();
