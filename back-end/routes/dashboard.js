const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');
const internDashboardController = require('../controllers/internDashboardController');

// 🔐 Protect ALL dashboard routes (MUST BE FIRST)
router.use(authMiddleware());

// 👨‍💼 Intern Dashboard
router.get('/intern', internDashboardController.getInternDashboard);

// 📊 Coordinator / Shared
router.get('/programs', dashboardController.getPrograms);
router.get('/companies', dashboardController.getCompanies);
router.get('/kpis', dashboardController.getKpis);
router.get('/adviser-programs', dashboardController.getAdviserPrograms);

// 👨‍🏫 Adviser-only KPI
router.get('/adviser-kpis', dashboardController.getAdviserKpis);

module.exports = router;
