const { asyncHandler } = require("../utils/asyncHandler");
const analyticsService = require("../services/analytics.service");
const reportService = require("../services/report.service");

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAnalytics = asyncHandler(async (req, res) => {
  const { date } = req.query; // Optional: ?date=2023-10-27
  
  const stats = await analyticsService.getDashboardAnalytics(date);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

// @desc    Generate and download daily PDF report
// @route   POST /api/admin/reports/daily
// @access  Private (Admin)

const getDailyReport = asyncHandler(async (req, res) => {
  const { date } = req.body;
  const dateStr = date || new Date().toISOString().split('T')[0];

  const doc = await reportService.generateDailyPDFReport(dateStr);

  // Set headers for PDF download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=mediqueue-report-${dateStr}.pdf`);

  doc.pipe(res);
  doc.end();
});

module.exports = {
  getAnalytics,
  getDailyReport,
};

