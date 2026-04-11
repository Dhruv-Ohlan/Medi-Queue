const mongoose = require("mongoose");
const { URGENCY_LEVELS, TOKEN_STATUSES } = require("../config/constants");

const tokenSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  tokenNumber: { type: Number, required: true },
  trackingId: { type: String, required: true },
  urgencyLevel: {
    type: String,
    enum: Object.values(URGENCY_LEVELS),
    required: true,
  },
  aiReasoning: { type: String },
  status: {
    type: String,
    enum: Object.values(TOKEN_STATUSES),
    default: TOKEN_STATUSES.WAITING,
  },
  calledById: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Track which doctor called the patient
  registeredAt: { type: Date, default: Date.now },
  calledAt: { type: Date },
  consultStartedAt: { type: Date }, // When the doctor actually started the visit
  completedAt: { type: Date },
  skipCount: { type: Number, default: 0 },
  requeueAt: { type: Date },
  notifiedRegistration: { type: Boolean, default: false },
  notifiedAlmostUp: { type: Boolean, default: false },
  notifiedCalled: { type: Boolean, default: false },
  emergencyAcknowledged: { type: Boolean, default: false },
  dayKey: { type: String, required: true },
}, { timestamps: true });

// Useful indexes for queue lookups
tokenSchema.index({ departmentId: 1, dayKey: 1, status: 1, urgencyLevel: 1, tokenNumber: 1 });

tokenSchema.index({ trackingId: 1 }, { unique: true });

module.exports = mongoose.model("Token", tokenSchema);
