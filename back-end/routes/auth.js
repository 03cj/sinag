/* eslint-env node */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); // store uploaded MOA PDFs

// ---------- Test Route ----------
console.log('✅ Auth routes loaded');
router.get('/test', (req, res) => {
  res.json({ message: 'auth route working' });
});

// ---------- Auth Routes ----------
router.post('/signup', authController.signup); // public signup
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me); // get logged-in user
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/change-password', authMiddleware, authController.changePassword);

// ---------- Adviser / Intern Routes ----------
router.post('/addAdviser', authMiddleware, authController.addAdviser); // coordinator/admin creates adviser
router.get('/advisers', authMiddleware, authController.getAdvisers); // get all advisers
router.post('/addIntern', authMiddleware, authController.addIntern); // adviser creates intern

// ---------- Company Routes ----------
router.post('/addCompany', upload.single('moaFile'), authController.addCompany); // add new company

// Get logged-in company info
router.get('/companies/me', authMiddleware, authController.getCompany);

// Update company profile
router.put('/companies/profile', authMiddleware, authController.updateCompanyProfile);

module.exports = router;
