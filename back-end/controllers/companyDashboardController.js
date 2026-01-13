/* eslint-env node */
const path = require('path');
const fs = require('fs');

const Company = require('../models/company');
const Intern = require('../models/interns');
const User = require('../models/user');

/* =========================
   GET COMPANY PROFILE
========================= */
exports.getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({
      where: { email: req.user.email },
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (err) {
    console.error('❌ getMyCompany error:', err);
    res.status(500).json({ message: 'Failed to load company profile' });
  }
};

/* =========================
   GET COMPANY INTERNS
========================= */
exports.getCompanyInterns = async (req, res) => {
  try {
    const company = await Company.findOne({
      where: { email: req.user.email },
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const interns = await Intern.findAll({
      where: { company_id: company.id },
      attributes: ['id', 'user_id', 'status', 'program'],
    });

    const result = [];

    for (const intern of interns) {
      const user = await User.findByPk(intern.user_id, {
        attributes: ['studentId', 'firstName', 'lastName', 'mi', 'email'],
      });

      if (user) {
        result.push({
          id: intern.id,
          studentId: user.studentId,
          firstName: user.firstName,
          lastName: user.lastName,
          mi: user.mi,
          email: user.email,
          status: intern.status,
          program: intern.program, // ✅ ADD THIS
        });
      }
    }

    res.json(result);
  } catch (err) {
    console.error('❌ getCompanyInterns error:', err);
    res.status(500).json({ message: 'Failed to load interns' });
  }
};

/* =========================
   UPLOAD / UPDATE MOA
========================= */
exports.uploadMoa = async (req, res) => {
  try {
    const company = await Company.findOne({
      where: { email: req.user.email },
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Delete old MOA if exists
    if (company.moaFile) {
      const oldPath = path.join(__dirname, '..', 'uploads', company.moaFile);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    company.moaFile = req.file.filename;
    await company.save();

    res.json({
      message: 'MOA uploaded successfully',
      moaFile: company.moaFile,
    });
  } catch (err) {
    console.error('❌ uploadMoa error:', err);
    res.status(500).json({ message: 'Failed to upload MOA' });
  }
};

/* =========================
   GET / VIEW MOA (INLINE PDF)
   COMPANY + INTERN
========================= */
exports.getMoa = async (req, res) => {
  try {
    let company = null;

    /* =========================
       COMPANY views own MOA
    ========================= */
    if (req.user.role === 'company') {
      company = await Company.findOne({
        where: { email: req.user.email },
      });
    }

    /* =========================
       INTERN views assigned MOA
    ========================= */
    if (req.user.role === 'intern') {
      const intern = await Intern.findOne({
        where: { user_id: req.user.id },
      });

      if (!intern || !intern.company_id) {
        return res.status(404).json({ message: 'No company assigned' });
      }

      company = await Company.findByPk(intern.company_id);
    }

    if (!company || !company.moaFile) {
      return res.status(404).json({ message: 'MOA not found' });
    }

    const moaPath = path.join(__dirname, '..', 'uploads', company.moaFile);

    if (!fs.existsSync(moaPath)) {
      return res.status(404).json({ message: 'MOA file missing on server' });
    }

    // 🔥 FORCE INLINE VIEWING
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');

    return res.sendFile(moaPath);
  } catch (err) {
    console.error('❌ getMoa error:', err);
    res.status(500).json({ message: 'Failed to load MOA' });
  }
};
