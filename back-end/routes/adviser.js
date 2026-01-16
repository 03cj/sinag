const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const {
  getAdviserForStudent,
  getProgramsForAdviser, // ✅ ADD THIS
} = require('../controllers/adviserController');

// Existing
router.get('/my-adviser', authMiddleware(), getAdviserForStudent);

// ✅ NEW: Programs handled by logged-in adviser
router.get('/my-programs', authMiddleware(), getProgramsForAdviser);

module.exports = router;
