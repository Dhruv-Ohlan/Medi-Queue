const express = require("express");
const { 
  getDeptQueue, 
  callPatient, 
  completeConsult, 
  skipPatient,
  acknowledgeEmergencyAction
} = require("../controllers/doctor.controller");
const { protect, authorize } = require("../middleware/auth");
const { ROLES } = require("../config/constants");

const router = express.Router();

// All doctor routes are protected
router.use(protect);

// GET Department Queue (Admin can see all, Doctor sees their own)
router.get("/departments/:id/queue", authorize(ROLES.DOCTOR, ROLES.ADMIN), getDeptQueue);

// Token Actions (Primarily Doctors)
router.post("/tokens/:id/call", authorize(ROLES.DOCTOR), callPatient);
router.post("/tokens/:id/complete", authorize(ROLES.DOCTOR), completeConsult);
router.post("/tokens/:id/skip", authorize(ROLES.DOCTOR), skipPatient);
router.post("/tokens/:id/emergency-ack", authorize(ROLES.DOCTOR), acknowledgeEmergencyAction);

module.exports = router;
