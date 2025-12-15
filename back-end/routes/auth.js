const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadInternDoc, getInternDocs } = require('../controllers/internDocsController');
const upload = require('../middleware/upload');

console.log('✅ Auth routes loaded');

// Public
router.get('/test', (req, res) => res.json({ message: 'auth route working' }));
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected
router.use(authMiddleware);
router.post('/addAdviser', authController.addAdviser);
router.get('/advisers', authController.getAdvisers);
router.post('/addIntern', authController.addIntern);
router.get('/interns', authController.getInterns);
router.get('/me', authController.me);
router.put('/profile', authController.updateProfile);
router.put('/change-password', authController.changePassword);

// HTE
router.post('/addCompany', upload.single('moaFile'), authController.addCompany);
router.get('/HTE', authController.getHTE);
router.get('/company/profile', authController.getCompanyProfile);
router.put('/company/profile', authController.updateCompanyProfile);

// Intern Documents
router.post('/:userId/docs', upload.single('document'), uploadInternDoc);
router.post('/intern-docs/upload', authMiddleware, upload.single('document'), uploadInternDoc);
router.get('/:userId/docs', getInternDocs);

module.exports = router;
