const express = require('express');
const router = express.Router();

const { createHTEEvaluation } = require('../controllers/hteEvaluationController');
const authMiddleware = require('../middleware/authMiddleware');

// =========================
// INTERN → HTE EVALUATION
// =========================
router.post(
  '/',
  authMiddleware(['intern']), // ✅ MUST BE CALLED
  createHTEEvaluation,
);

module.exports = router;
