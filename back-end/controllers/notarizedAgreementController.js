const Intern = require('../models/interns');
const User = require('../models/user');
const Company = require('../models/company');
const generateAgreementPDF = require('../utils/generateNotarizedAgreementPDF');

/* =========================
   GET AGREEMENT DATA
========================= */
exports.getAgreementData = async (req, res) => {
  try {
    const intern = await Intern.findOne({
      where: { user_id: req.user.id },
      include: [{ model: User }, { model: Company }],
    });

    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    res.json({
      studentName: `${intern.User.firstName} ${intern.User.lastName}`,
      guardian: intern.User.guardian,
      program: intern.program, // ✅ FIXED
      startDate: intern.start_date,
      hteName: intern.Company?.name || '',
      hteAddress: intern.Company?.address || '',
      authorizedRep: intern.Company?.supervisorName || '', // ✅ FIXED
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   SAVE & GENERATE PDF
========================= */
exports.saveAgreement = async (req, res) => {
  try {
    const { guardianName, hours, endDate } = req.body;

    const intern = await Intern.findOne({
      where: { user_id: req.user.id },
      include: [{ model: User }, { model: Company }],
    });

    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    // 🔐 SAVE EDITABLE FIELDS
    await intern.User.update({ guardian: guardianName });
    await intern.update({
      required_hours: hours,
      end_date: endDate,
    });

    const fileUrl = await generateAgreementPDF({
      studentName: `${intern.User.firstName} ${intern.User.lastName}`,
      guardian: guardianName,
      program: intern.program, // ✅ FIXED
      startDate: intern.start_date,
      endDate,
      hours,
      hteName: intern.Company?.name || '',
      hteAddress: intern.Company?.address || '',
      authorizedRep: intern.Company?.supervisorName || '', // ✅ FIXED
    });

    res.json({ fileUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
