const { asyncHandler } = require("../utils/asyncHandler");
const queueService = require("../services/queue.service");
const { ROLES } = require("../config/constants");
const { idParamSchema } = require("../validators/doctor.validator");

// @desc    Get queue for a specific department
// @route   GET /api/departments/:id/queue
// @access  Private (Doctor/Admin)
const getDeptQueue = asyncHandler(async (req, res) => {
  const paramValidation = idParamSchema.safeParse(req.params);
  if (!paramValidation.success) {
    return res.status(400).json({ success: false, message: "Invalid Department ID format" });
  }

  const departmentId = req.params.id;

  // Security: Doctors can only see their own department queue
  if (req.user.role === ROLES.DOCTOR && req.user.departmentId?.toString() !== departmentId) {
    return res.status(403).json({
      success: false,
      message: "Access denied to this department queue",
    });
  }

  const result = await queueService.getDepartmentQueue(departmentId);

  res.status(200).json({
    success: true,
    data: result,
  });
});

// @desc    Call a patient from the queue
// @route   POST /api/tokens/:id/call
// @access  Private (Doctor)
const callPatient = asyncHandler(async (req, res) => {
  const paramValidation = idParamSchema.safeParse(req.params);
  if (!paramValidation.success) {
    return res.status(400).json({ success: false, message: "Invalid Token ID format" });
  }

  const tokenId = req.params.id;
  
  // Potential optimization: Check if doctor has authority over this token's dept
  const updatedToken = await queueService.callToken(tokenId, req.user._id);

  res.status(200).json({
    success: true,
    message: "Patient called",
    data: updatedToken
  });
});

// @desc    Mark consult as completed
// @route   POST /api/tokens/:id/complete
// @access  Private (Doctor)
const completeConsult = asyncHandler(async (req, res) => {
  const paramValidation = idParamSchema.safeParse(req.params);
  if (!paramValidation.success) {
    return res.status(400).json({ success: false, message: "Invalid Token ID format" });
  }

  const tokenId = req.params.id;
  const updatedToken = await queueService.completeToken(tokenId);

  res.status(200).json({
    success: true,
    message: "Consult completed",
    data: updatedToken
  });
});

// @desc    Skip a patient (move to bottom of urgency bucket)
// @route   POST /api/tokens/:id/skip
// @access  Private (Doctor)
const skipPatient = asyncHandler(async (req, res) => {
  const paramValidation = idParamSchema.safeParse(req.params);
  if (!paramValidation.success) {
    return res.status(400).json({ success: false, message: "Invalid Token ID format" });
  }

  const tokenId = req.params.id;
  const updatedToken = await queueService.skipToken(tokenId);

  res.status(200).json({
    success: true,
    message: "Patient skipped and moved to end of priority list",
    data: updatedToken
  });
});

// @desc    Acknowledge emergency alert
// @route   POST /api/tokens/:id/emergency-ack
// @access  Private (Doctor)
const acknowledgeEmergencyAction = asyncHandler(async (req, res) => {
  const paramValidation = idParamSchema.safeParse(req.params);
  if (!paramValidation.success) {
    return res.status(400).json({ success: false, message: "Invalid Token ID format" });
  }

  const tokenId = req.params.id;
  const updatedToken = await queueService.acknowledgeEmergency(tokenId);

  res.status(200).json({
    success: true,
    message: "Emergency acknowledged",
    data: updatedToken
  });
});


module.exports = {
  getDeptQueue,
  callPatient,
  completeConsult,
  skipPatient,
  acknowledgeEmergencyAction,
};
