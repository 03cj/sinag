const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

router.use(authMiddleware());

router.get('/programs', dashboardController.getPrograms);
router.get('/companies', dashboardController.getCompanies);
router.get('/kpis', dashboardController.getKpis);
router.get('/adviser-programs', dashboardController.getAdviserPrograms);

module.exports = router;
