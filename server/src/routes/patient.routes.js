const express = require("express");
const { registerToken, getTokenStatus } = require("../controllers/patient.controller");

const router = express.Router();

// @route   POST /api/tokens/register
router.post("/register", registerToken);

// @route   GET /api/tokens/:trackingId/status
router.get("/:trackingId/status", getTokenStatus);

module.exports = router;
