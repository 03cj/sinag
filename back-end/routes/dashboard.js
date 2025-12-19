/* eslint-env node */
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

/* =========================
   PROTECTED ROUTES
========================= */
router.use(authMiddleware()); // ✅ MUST be invoked

/* =========================
   DASHBOARD ROUTES
========================= */

// Program statistics
router.get('/programs', dashboardController.getProgramStats);

// Company statistics
router.get('/companies', dashboardController.getCompanyStats);

// KPI summary
router.get('/kpis', dashboardController.getKpis);

module.exports = router; // ✅ export router ONLY
