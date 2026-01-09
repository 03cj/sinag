/* eslint-env node */
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const internDocsController = require('../controllers/internDocsController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const companyDashboardController = require('../controllers/companyDashboardController');

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
   COORDINATORS (SUPERADMIN)
========================= */
router.post('/addCoordinator', authMiddleware(['superadmin']), authController.addCoordinator);

/* =========================
   ADVISERS (COORDINATOR)
========================= */
router.get('/advisers', authController.getAdvisers);

router.post('/addAdviser', authMiddleware(['coordinator']), authController.addAdviser);

router.put('/advisers/:id', authMiddleware(['coordinator']), authController.updateAdviser);

router.delete('/advisers/:id', authMiddleware(['coordinator']), authController.deleteAdviser);

/* =========================
   INTERNS
========================= */
router.post('/addIntern', authMiddleware(['adviser']), authController.addIntern);

router.get('/interns', authController.getInterns);

router.put('/interns/:id', authMiddleware(['adviser', 'coordinator']), authController.updateIntern);

router.put('/interns/:id/status', authMiddleware(['adviser', 'coordinator']), authController.updateInternStatus);

router.put('/interns/:id/assign-hte', authMiddleware(['adviser', 'coordinator']), authController.assignHTE);

router.delete('/interns/:id', authMiddleware(['coordinator']), authController.deleteIntern);
/* =========================
   CONSENT DATA
========================= */
const consentController = require('../controllers/consentController');

router.get('/consent-data', authMiddleware(['intern']), consentController.getConsentData);

router.post('/consent-save', authMiddleware(['intern']), consentController.saveConsentData);

/* =========================
   INTERN DOCUMENTS
========================= */

// ✅ UPLOAD / UPDATE DOCUMENT
router.post(
  '/intern-docs/upload',
  authMiddleware(['intern']), // must exist
  upload.single('file'), // must match frontend
  internDocsController.uploadInternDoc,
);

// ✅ GET INTERN DOCUMENTS (CHECKLIST)
router.get('/intern-docs/me', authMiddleware(['intern']), internDocsController.getInternDocuments);

// ✅ DELETE DOCUMENT
router.delete('/intern-docs/:column', authMiddleware(['intern']), internDocsController.deleteInternDoc);

/* =========================
   COMPANY / HTE
========================= */
router.post('/addCompany', authMiddleware(['coordinator']), upload.single('moaFile'), authController.addCompany);

router.get('/HTE', authController.getHTE);

router.put('/HTE/:id', authMiddleware(['coordinator']), upload.single('moaFile'), authController.updateCompany);

router.delete('/HTE/:id', authMiddleware(['coordinator']), authController.deleteHTE);
/* =========================
   COMPANY DASHBOARD (COMPANY ROLE)
========================= */

// 🔹 Get logged-in company profile
router.get('/company/me', authMiddleware(['company']), companyDashboardController.getMyCompany);

// 🔹 Get interns assigned to this company
router.get('/company/interns', authMiddleware(['company']), companyDashboardController.getCompanyInterns);

// 🔹 Upload / update MOA file
router.put('/company/moa', authMiddleware(['company']), upload.single('moaFile'), companyDashboardController.uploadMoa);
// 🔹 View / download MOA (Intern or Company)
router.get('/company/moa', authMiddleware(['intern', 'company']), companyDashboardController.getMoa);

module.exports = router;
