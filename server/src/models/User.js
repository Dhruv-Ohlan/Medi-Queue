const mongoose = require("mongoose");
const { ROLES } = require("../config/constants");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: Object.values(ROLES),
    required: true,
  },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
