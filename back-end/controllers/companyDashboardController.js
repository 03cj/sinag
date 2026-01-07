/* eslint-env node */

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
    // 1️⃣ Get company
    const company = await Company.findOne({
      where: { email: req.user.email },
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // 2️⃣ Get interns assigned to this company
    const interns = await Intern.findAll({
      where: { company_id: company.id },
      attributes: ['id', 'user_id', 'status'],
    });

    // 3️⃣ Load user data using studentId
    const result = [];

    for (const intern of interns) {
      const user = await User.findByPk(intern.user_id, {
        attributes: ['studentId', 'firstName', 'lastName', 'mi', 'email'],
      });

      if (user) {
        result.push({
          id: intern.id,
          studentId: user.studentId, // ✅ USE studentId
          firstName: user.firstName,
          lastName: user.lastName,
          mi: user.mi,
          email: user.email,
          status: intern.status,
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
