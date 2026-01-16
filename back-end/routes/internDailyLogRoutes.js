// routes/internDailyLogRoutes.js
const express = require('express');
const router = express.Router();
const { createDailyLog } = require('../controllers/internDailyLogController');

router.post('/daily-log', createDailyLog);

module.exports = router;
