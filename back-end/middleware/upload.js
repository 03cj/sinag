/* eslint-env node */
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {
    try {
      const lastName = (req.user?.lastName || 'UNKNOWN').toUpperCase().replace(/\s+/g, '_');

      const originalName = path
        .basename(file.originalname, path.extname(file.originalname))
        .toUpperCase()
        .replace(/\s+/g, '_');

      const ext = path.extname(file.originalname);

      // 🔥 ADD IT HERE
      const filename = `${lastName}_${originalName}_${Date.now()}${ext}`;

      cb(null, filename);
    } catch (err) {
      cb(err);
    }
  },
});

const upload = multer({ storage });

module.exports = upload;
