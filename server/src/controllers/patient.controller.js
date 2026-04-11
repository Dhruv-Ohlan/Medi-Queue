const { asyncHandler } = require("../utils/asyncHandler");
const { registerPatientSchema } = require("../validators/patient.validator");
const tokenService = require("../services/token.service");
const queueService = require("../services/queue.service");

// @desc    Register a new patient and generate a token
// @route   POST /api/tokens/register
// @access  Public
const registerToken = asyncHandler(async (req, res) => {
  // Validate request body
  const validationResult = registerPatientSchema.safeParse(req.body);
  
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid registration data",
      errors: validationResult.error.errors.map(err => ({
        path: err.path.join("."),
        message: err.message
      })),
    });
  }

  // Execute registration flow
  const result = await tokenService.registerPatient(validationResult.data);

  // Return clean frontend-ready JSON
  res.status(201).json({
    success: true,
    data: result,
  });
});

// @desc    Get live status of a token
// @route   GET /api/tokens/:trackingId/status
// @access  Public
const getTokenStatus = asyncHandler(async (req, res) => {
  const { trackingId } = req.params;

  if (!trackingId) {
    return res.status(400).json({
      success: false,
      message: "Tracking ID is required",
    });
  }

  const status = await queueService.getPatientQueueStatus(trackingId);

  res.status(200).json({
    success: true,
    data: status,
  });
});

module.exports = {
  registerToken,
  getTokenStatus,
};
