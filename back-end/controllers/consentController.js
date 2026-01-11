/* eslint-env node */
const Intern = require('../models/interns');
const User = require('../models/user');
const Company = require('../models/company');
const generateConsentPDF = require('../utils/generateConsentPDF');

/* =========================
   GET CONSENT DATA
========================= */
exports.getConsentData = async (req, res) => {
  try {
    const intern = await Intern.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'guardian', 'program'],
        },
        {
          model: Company,
          attributes: ['name', 'address'],
        },
      ],
    });

    if (!intern || !intern.Company) {
      return res.status(400).json({
        message: 'HTE not yet assigned.',
      });
    }

    res.json({
      studentName: `${intern.User.firstName} ${intern.User.lastName}`,
      guardian: intern.User.guardian || '',
      program: intern.User.program,
      hteName: intern.Company.name,
      hteAddress: intern.Company.address,
      startDate: intern.start_date,
      endDate: intern.end_date || '',
      hours: intern.required_hours || '',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   SAVE + GENERATE PDF
========================= */
exports.saveConsent = async (req, res) => {
  try {
    const { guardianName, hours, endDate } = req.body;

    if (!guardianName || !hours || !endDate) {
      return res.status(400).json({
        message: 'Guardian name, required hours, and end date are required.',
      });
    }

    const intern = await Intern.findOne({
      where: { user_id: req.user.id },
      include: [{ model: User }, { model: Company }],
    });

    if (!intern || !intern.Company || !intern.User) {
      return res.status(400).json({
        message: 'Consent data incomplete.',
      });
    }

    await intern.update({
      end_date: endDate,
      required_hours: hours,
    });

    await intern.User.update({
      guardian: guardianName,
    });

    const filename = `CONSENT_${intern.id}_${Date.now()}.pdf`;

    await generateConsentPDF(
      {
        studentName: `${intern.User.firstName} ${intern.User.lastName}`,
        guardian: guardianName,
        program: intern.User.program,
        hteName: intern.Company.name,
        hteAddress: intern.Company.address,
        startDate: intern.start_date,
        endDate,
        hours,
      },
      filename,
    );

    res.json({ fileUrl: `/uploads/${filename}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
