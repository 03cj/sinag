/* eslint-env node */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // store uploaded MOA PDFs



//test route
console.log('✅ Auth routes loaded');
router.get('/test', (req, res) => {
  res.json({ message: 'auth route working' });
});

router.post('/signup', authController.signup); // public signup
router.post('/addAdviser', authMiddleware, authController.addAdviser); // coordinator/admin creates adviser
router.get('/advisers', authMiddleware, authController.getAdvisers); // get all advisers
router.post('/addIntern', authMiddleware, authController.addIntern); // adviser creates intern
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/change-password', authMiddleware, authController.changePassword);

router.post('/addCompany', upload.single('moaFile'), authController.addCompany);


module.exports = router;
