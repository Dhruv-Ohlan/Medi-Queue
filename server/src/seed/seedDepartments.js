const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectDB } = require('../config/db');
const Department = require('../models/Department');
const Hospital = require('../models/Hospital');

dotenv.config();

const seedDepartments = async () => {
  await connectDB();

  try {
    // Clear existing
    await Department.deleteMany({});
    await Hospital.deleteMany({});

    // Create demo hospital
    const hospital = await Hospital.create({
      name: "MediQueue General Hospital",
      address: "123 Health Ave, Wellness City",
      contactNumber: "1-800-MED-QUEUE"
    });

    const demoDepartments = [
      {
        hospitalId: hospital._id,
        name: "General Medicine",
        dailyCapacity: 150,
        isActive: true
      },
      {
        hospitalId: hospital._id,
        name: "Paediatrics",
        dailyCapacity: 100,
        isActive: true
      },
      {
        hospitalId: hospital._id,
        name: "Orthopaedics",
        dailyCapacity: 80,
        isActive: true
      }
    ];

    await Department.insertMany(demoDepartments);
    console.log("Departments seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding departments:", error);
    process.exit(1);
  }
};

seedDepartments();
