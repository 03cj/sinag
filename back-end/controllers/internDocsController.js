/* eslint-env node */
const fs = require('fs');
const path = require('path');

const InternDocuments = require('../models/InternDocuments');
const Intern = require('../models/interns');
const Company = require('../models/company');

/* =========================
   UPLOAD / UPDATE INTERN DOCUMENT
========================= */
// POST /api/auth/intern-docs/upload
async function uploadInternDoc(req, res, next) {
  try {
    const file = req.file;
    if (file.originalname.toLowerCase().includes('moa')) {
      return res.status(403).json({
        message: 'MOA is provided by the company and cannot be uploaded by interns',
      });
    }

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // find intern by logged-in user
    const intern = await Intern.findOne({
      where: { user_id: req.user.id },
    });

    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    // map filename to column based on filename keyword
    const filename = file.filename.toLowerCase();

    let targetColumn = null;

    if (filename.includes('notarized')) targetColumn = 'notarized_agreement';
    else if (filename.includes('medical')) targetColumn = 'medical_cert';
    else if (filename.includes('insurance')) targetColumn = 'insurance';
    else if (filename.includes('resume')) targetColumn = 'resume';
    else if (filename.includes('cor')) targetColumn = 'cor';
    else if (filename.includes('consent')) targetColumn = 'consent_form';

    if (!targetColumn) {
      return res.status(400).json({
        message: 'Filename must include document type (e.g. LASTNAME_COR.pdf)',
      });
    }

    // find or create document row
    const [docs] = await InternDocuments.findOrCreate({
      where: { intern_id: intern.id },
      defaults: { intern_id: intern.id },
    });

    // overwrite old file if exists
    if (docs[targetColumn]) {
      const oldPath = path.join(__dirname, '..', 'uploads', docs[targetColumn]);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    docs[targetColumn] = file.filename;
    docs.uploaded_at = new Date();
    await docs.save();

    res.json({
      message: 'Document uploaded successfully',
      column: targetColumn,
      file: file.filename,
    });
  } catch (err) {
    console.error('❌ UPLOAD INTERN DOC ERROR:', err);
    next(err);
  }
}

/* =========================
   GET INTERN DOCUMENTS
========================= */
// GET /api/auth/intern-docs/me
async function getInternDocuments(req, res, next) {
  try {
    const intern = await Intern.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: Company,
          attributes: ['moaFile'],
        },
      ],
    });

    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    const docs = await InternDocuments.findOne({
      where: { intern_id: intern.id },
    });

    res.json({
      ...(docs?.dataValues || {}),
      MOA: intern.Company?.moaFile || null,
    });
  } catch (err) {
    console.error('❌ GET INTERN DOCS ERROR:', err);
    next(err);
  }
}

/* =========================
   DELETE INTERN DOCUMENT
========================= */
// DELETE /api/auth/intern-docs/:column
async function deleteInternDoc(req, res, next) {
  try {
    const { column } = req.params;

    if (column === 'MOA') {
      return res.status(403).json({
        message: 'MOA cannot be deleted by interns',
      });
    }

    const allowedColumns = ['consent_form', 'notarized_agreement', 'resume', 'cor', 'insurance', 'medical_cert'];

    if (!allowedColumns.includes(column)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    const intern = await Intern.findOne({
      where: { user_id: req.user.id },
    });

    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    const docs = await InternDocuments.findOne({
      where: { intern_id: intern.id },
    });

    if (!docs || !docs[column]) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', docs[column]);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    docs[column] = null;
    await docs.save();

    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error('❌ DELETE INTERN DOC ERROR:', err);
    next(err);
  }
}

module.exports = {
  uploadInternDoc,
  getInternDocuments,
  deleteInternDoc,
};
