/* eslint-env node */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Test route
console.log('✅ Auth routes loaded');
router.get('/test', (req, res) => {
  res.json({ message: 'auth route working' });
});

router.post('/signup', authController.signup);
router.post('/addAdviser', authMiddleware, authController.addAdviser);
router.get('/advisers', authMiddleware, authController.getAdvisers);
router.post('/addIntern', authMiddleware, authController.addIntern);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/change-password', authMiddleware, authController.changePassword);
router.get('/interns', authMiddleware, authController.getInterns);

module.exports = router;
