const express = require("express");
const { getAnalytics, getDailyReport } = require("../controllers/admin.controller");

const { protect, authorize } = require("../middleware/auth");
const { ROLES } = require("../config/constants");

const router = express.Router();

// All admin routes are protected and restricted to ADMIN role
router.use(protect);
router.use(authorize(ROLES.ADMIN));

router.get("/analytics", getAnalytics);
router.post("/reports/daily", getDailyReport);

module.exports = router;

