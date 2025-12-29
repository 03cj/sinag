/* eslint-env node */
const InternDocs = require('../models/interndocs');
const User = require('../models/user');

/* =========================
   UPLOAD INTERN DOCUMENT
========================= */
// POST /api/auth/intern-docs/upload
async function uploadInternDoc(req, res, next) {
  try {
    const { docType } = req.body;
    const file = req.file;

    if (!docType) {
      return res.status(400).json({ message: 'Document type is required' });
    }

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const doc = await InternDocs.create({
      docType,
      filePath: file.filename,
      user_id: userId,
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      doc,
    });
  } catch (err) {
    next(err);
  }
}

/* =========================
   GET INTERN DOCUMENTS
========================= */
// GET /api/auth/intern-docs/:userId
async function getInternDocs(req, res, next) {
  try {
    const { userId } = req.params;

    const docs = await InternDocs.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });

    res.json(docs);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  uploadInternDoc,
  getInternDocs,
};
