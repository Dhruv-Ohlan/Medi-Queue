const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  phoneNumber: { type: String, required: true },
  phoneHash: String,
  phoneMasked: String,
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);
