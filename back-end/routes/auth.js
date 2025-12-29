/* eslint-env node */
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

console.log('✅ Auth routes loaded');

/* =========================
   PUBLIC ROUTES
========================= */
router.get('/test', (req, res) => {
  res.json({ message: 'auth route working' });
});

router.post('/signup', authController.signup);
router.post('/login', authController.login);

/* =========================
   PROTECTED ROUTES
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
   (SUPERADMIN ONLY)
========================= */
router.post(
  '/addCoordinator',
  authMiddleware(['superadmin']),
  authController.addCoordinator
);

/* =========================
   ADVISERS
   (COORDINATOR)
========================= */
router.get('/advisers', authController.getAdvisers);

router.post(
  '/addAdviser',
  authMiddleware(['coordinator']),
  authController.addAdviser
);

router.put(
  '/advisers/:id',
  authMiddleware(['coordinator']),
  authController.updateAdviser
);

router.delete(
  '/advisers/:id',
  authMiddleware(['coordinator']),
  authController.deleteAdviser
);

/* =========================
   INTERNS
========================= */
router.post(
  '/addIntern',
  authMiddleware(['adviser']),
  authController.addIntern
);

router.get('/interns', authController.getInterns);

router.put(
  '/interns/:id',
  authMiddleware(['adviser', 'coordinator']),
  authController.updateIntern
);

router.delete(
  '/interns/:id',
  authMiddleware(['coordinator']),
  authController.deleteIntern
);

/* =========================
   COMPANY / HTE
========================= */
router.post(
  '/addCompany',
  authMiddleware(['coordinator']),
  upload.single('moaFile'),
  authController.addCompany
);

router.get('/HTE', authController.getHTE);

router.put(
  '/HTE/:id',
  authMiddleware(['coordinator']),
  upload.single('moaFile'),
  authController.updateCompany
);

router.delete(
  '/HTE/:id',
  authMiddleware(['coordinator']),
  authController.deleteHTE
);

module.exports = router;
