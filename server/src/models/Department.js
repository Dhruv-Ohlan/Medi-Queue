const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
  name: { type: String, required: true },
  dailyCapacity: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Department", departmentSchema);
