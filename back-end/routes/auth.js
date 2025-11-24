/* eslint-env node */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

//test route
console.log('✅ Auth routes loaded');
router.get('/test', (req, res) => {
  res.json({ message: 'auth route working' });
});

router.post('/signup', authController.signup); // public signup
router.post('/addAdviser', authMiddleware, authController.addAdviser); // coordinator/admin creates adviser
router.get('/advisers', authMiddleware, authController.getAdvisers); // get all advisers
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
