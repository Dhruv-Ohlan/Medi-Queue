const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/db');
const User = require('../models/User');
const Department = require('../models/Department');
const { ROLES } = require('../config/constants');

dotenv.config();

const seedUsers = async () => {
  await connectDB();

  try {
    await User.deleteMany({});
    
    // Find departments to map doctors
    const generalMedicine = await Department.findOne({ name: 'General Medicine' });
    const paediatrics = await Department.findOne({ name: 'Paediatrics' });
    const orthopaedics = await Department.findOne({ name: 'Orthopaedics' });

    const passwordHash = await bcrypt.hash('password123', 10);

    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@mediqueue.com',
        passwordHash,
        role: ROLES.ADMIN,
        departmentId: null
      },
      {
        name: 'Dr. John Smith',
        email: 'doctor.gm@mediqueue.com',
        passwordHash,
        role: ROLES.DOCTOR,
        departmentId: generalMedicine ? generalMedicine._id : null
      },
      {
        name: 'Dr. Sarah Johnson',
        email: 'doctor.paeds@mediqueue.com',
        passwordHash,
        role: ROLES.DOCTOR,
        departmentId: paediatrics ? paediatrics._id : null
      },
      {
        name: 'Dr. Michael Chen',
        email: 'doctor.ortho@mediqueue.com',
        passwordHash,
        role: ROLES.DOCTOR,
        departmentId: orthopaedics ? orthopaedics._id : null
      }
    ];

    await User.insertMany(demoUsers);
    console.log("Users seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
