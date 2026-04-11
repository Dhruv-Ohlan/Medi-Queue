const Token = require("../models/Token");
const { TOKEN_STATUSES, URGENCY_LEVELS } = require("../config/constants");
const { getDateRange } = require("../utils/dateBuckets");

/**
 * Gets aggregated dashboard analytics for the admin.
 * @param {string} date - ISO date string (YYYY-MM-DD)
 */
const getDashboardAnalytics = async (dateStr) => {
  const { start, end } = getDateRange(dateStr);

  const matchQuery = {
    registeredAt: { $gte: start, $lte: end },
  };

  // 1. Overview & Department Breakdown
  const deptStats = await Token.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: "$departmentId",
        totalRegistered: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ["$status", TOKEN_STATUSES.COMPLETED] }, 1, 0] } },
        called: { $sum: { $cond: [{ $eq: ["$status", TOKEN_STATUSES.CALLED] }, 1, 0] } },
        waiting: { $sum: { $cond: [{ $eq: ["$status", TOKEN_STATUSES.WAITING] }, 1, 0] } },
        totalWaitMs: {
          $sum: {
            $cond: [
              { $and: [{ $ne: ["$calledAt", null] }, { $eq: ["$status", TOKEN_STATUSES.COMPLETED] }] },
              { $subtract: ["$calledAt", "$registeredAt"] },
              0
            ]
          }
        },
        consultCount: { $sum: { $cond: [{ $ne: ["$calledAt", null] }, 1, 0] } }
      }
    },
    {
      $lookup: {
        from: "departments",
        localField: "_id",
        foreignField: "_id",
        as: "department"
      }
    },
    { $unwind: "$department" },
    {
      $project: {
        name: "$department.name",
        totalRegistered: 1,
        completed: 1,
        called: 1,
        waiting: 1,
        avgWaitTimeMinutes: {
          $cond: [
            { $gt: ["$consultCount", 0] },
            { $divide: [{ $divide: ["$totalWaitMs", 60000] }, "$consultCount"] },
            0
          ]
        }
      }
    }
  ]);

  // 2. Triage Distribution
  const triageStats = await Token.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: "$urgencyLevel",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        urgency: "$_id",
        count: 1,
        _id: 0
      }
    }
  ]);

  // 3. Peak Load (30-minute buckets)
  const peakLoad = await Token.aggregate([
    { $match: matchQuery },
    {
      $project: {
        timeBucket: {
          $dateToString: {
            format: "%H:%M",
            date: {
              $toDate: {
                $subtract: [
                  { $toLong: "$registeredAt" },
                  { $mod: [{ $toLong: "$registeredAt" }, 1800000] } // 30 mins = 1800000 ms
                ]
              }
            }
          }
        }
      }
    },
    {
      $group: {
        _id: "$timeBucket",
        registrations: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        time: "$_id",
        registrations: 1,
        _id: 0
      }
    }
  ]);

  // 4. Totals and Global Metrics
  const summary = deptStats.reduce((acc, dept) => {
    acc.totalRegistered += dept.totalRegistered;
    acc.totalCompleted += dept.completed;
    acc.totalWaiting += dept.waiting;
    acc.totalCalled += dept.called;
    return acc;
  }, { totalRegistered: 0, totalCompleted: 0, totalWaiting: 0, totalCalled: 0 });

  const totalCompletedTokens = await Token.countDocuments({
    ...matchQuery,
    status: TOKEN_STATUSES.COMPLETED
  });

  return {
    summary,
    departmentBreakdown: deptStats,
    triageDistribution: triageStats,
    peakLoadTimeSeries: peakLoad,
    dateRange: { start, end }
  };
};

module.exports = {
  getDashboardAnalytics
};
