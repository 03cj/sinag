const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const {
  createDailyLog,
  getDailyLogs,
  getInternDailyLogsForAdviser,
  approveLogByAdviser,
} = require('../controllers/internDailyLogController');

// =============================
// INTERN ROUTES
// =============================
router.post('/daily-log', authMiddleware('intern'), createDailyLog);
router.get('/daily-logs', authMiddleware('intern'), getDailyLogs);

// =============================
// ADVISER ROUTES
// =============================
router.get('/daily-logs/:id', authMiddleware('adviser'), getInternDailyLogsForAdviser);
router.put('/daily-logs/:reportId/adviser-approve', authMiddleware('adviser'), approveLogByAdviser);

module.exports = router;
