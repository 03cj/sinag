/* eslint-env node */
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { uploadInternDoc, getInternDocs } = require('../controllers/internDocsController');

console.log('✅ Auth routes loaded');

/* =========================
   PUBLIC ROUTES
========================= */

// Health check
router.get('/test', (req, res) => {
  res.json({ message: 'auth route working' });
});

// Authentication
router.post('/signup', authController.signup);
router.post('/login', authController.login);

/* =========================
   PROTECTED ROUTES
========================= */
router.use(authMiddleware()); // ✅ correct (factory middleware)

/* =========================
   USER PROFILE
========================= */
router.get('/me', authController.me);
router.put('/profile', authController.updateProfile);
router.put('/change-password', authController.changePassword);

/* =========================
   INTERNS
========================= */
router.post('/addIntern', authController.addIntern);
router.get('/interns', authController.getInterns);

/* =========================
   ADVISERS ROUTES
========================= */
router.get('/advisers', authController.getAdvisers);
b;

/* =========================
   COMPANY / HTE
========================= */
router.post('/addCompany', upload.single('moaFile'), authController.addCompany);

router.get('/HTE', authController.getHTE);

/* =========================
   INTERN DOCUMENTS
========================= */
router.post('/intern-docs/upload', upload.single('document'), uploadInternDoc);

router.get('/intern-docs/:userId', getInternDocs);

/* =========================
   EXPORT ROUTER
========================= */
module.exports = router;
