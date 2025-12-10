/* eslint-env node */
const express = require('express');
const fs = require('fs');
const multer = require('multer');

const router = express.Router();

// Ensure upload folder exists
const uploadPath = 'uploads/library';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (_, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  },
});

const upload = multer({ storage });

// POST /api/documents/upload
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.status(200).json({
    message: 'PDF saved to Library!',
    file: req.file.filename,
    path: req.file.path,
  });
});

module.exports = router;
