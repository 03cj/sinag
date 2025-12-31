/* eslint-env node */
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const { uploadInternDoc, getInternDocuments } = require('../controllers/internDocsController');

/* =========================
   PROTECTED ROUTES
========================= */
router.use(authMiddleware());

/* =========================
   INTERN DOCUMENT ROUTES
========================= */

// Upload intern document
router.post('/intern-docs/upload', upload.single('document'), uploadInternDoc);

// Get intern documents by user ID
router.get('/intern-docs/:userId', getInternDocuments);

module.exports = router; // ✅ MUST export router ONLY
