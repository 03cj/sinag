const InternDocs = require('../models/interndocs');
const User = require('../models/user');

// POST /api/interns/:userId/docs
async function uploadInternDoc(req, res, next) {
  try {
    const { docType } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    // Use the logged-in user ID from JWT
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newDoc = await InternDocs.create({
      docType,
      filePath: file.filename,
      user_id: userId,
    });

    res.status(201).json({ message: 'File uploaded', doc: newDoc });
  } catch (err) {
    next(err);
  }
}

// GET /api/interns/:userId/docs
async function getInternDocs(req, res, next) {
  try {
    const { userId } = req.params;
    const docs = await InternDocs.findAll({ where: { user_id: userId } });
    res.json(docs);
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadInternDoc, getInternDocs };
