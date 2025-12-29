const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

// 🔐 Protect all dashboard routes
router.use(authMiddleware());

// 📊 Coordinator / Shared
router.get('/programs', dashboardController.getPrograms);
router.get('/companies', dashboardController.getCompanies);
router.get('/kpis', dashboardController.getKpis);
router.get('/adviser-programs', dashboardController.getAdviserPrograms);

// 👨‍🏫 Adviser-only KPI
router.get('/adviser-kpis', dashboardController.getAdviserKpis);

module.exports = router;
