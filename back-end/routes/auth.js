/* eslint-env node */
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  uploadInternDoc,
  getInternDocs,
} = require('../controllers/internDocsController');

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
   (requires valid JWT)
========================= */
router.use(authMiddleware());

/* =========================
   USER PROFILE
========================= */
router.get('/me', authController.me);
router.put('/profile', authController.updateProfile);
router.put('/change-password', authController.changePassword);

/* =========================
   COORDINATORS
   (Coordinator is the highest role)
========================= */
router.post(
  '/addCoordinator',
  authMiddleware(['coordinator']), // ✅ FIXED
  authController.addCoordinator
);

/* =========================
   ADVISERS
========================= */
router.get('/advisers', authController.getAdvisers);
router.post('/addAdviser', authController.addAdviser);
router.put('/advisers/:id', authController.updateAdviser);
router.delete('/advisers/:id', authController.deleteAdviser);

/* =========================
   INTERNS
========================= */
router.post('/addIntern', authController.addIntern);
router.get('/interns', authController.getInterns);

/* =========================
   COMPANY / HTE
========================= */
router.post(
  '/addCompany',
  upload.single('moaFile'),
  authController.addCompany
);
router.get('/HTE', authController.getHTE);
router.put(
  '/HTE/:id',
  upload.single('moaFile'),
  authController.updateCompany
);
router.delete('/HTE/:id', authController.deleteHTE);

/* =========================
   INTERN DOCUMENTS
========================= */
router.post(
  '/intern-docs/upload',
  upload.single('document'),
  uploadInternDoc
);
router.get('/intern-docs/:userId', getInternDocs);

/* =========================
   EXPORT ROUTER
========================= */
module.exports = router;
