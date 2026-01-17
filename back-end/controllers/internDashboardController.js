/* eslint-env node */
'use strict';

const { User, Intern, Company, InternDocuments } = require('../models');

exports.getInternDashboard = async (req, res) => {
  try {
    /* =========================
       AUTH USER
    ========================= */
    const userId = req.user.id;

    /* =========================
       FETCH INTERN + RELATIONS
    ========================= */
    const intern = await Intern.findOne({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'student', // ✅ MUST MATCH Intern.associate
          attributes: ['firstName', 'lastName', 'mi', 'studentId'],
        },
        {
          model: Company,
          as: 'company', // ✅ MUST MATCH Intern.associate
          required: false,
          attributes: ['name', 'supervisorName', 'moaStart', 'moaEnd'],
        },
        {
          model: InternDocuments,
          as: 'documents', // ✅ MUST MATCH Intern.associate
          required: false,
        },
      ],
    });

    /* =========================
       VALIDATION
    ========================= */
    if (!intern) {
      return res.status(404).json({ message: 'Intern record not found' });
    }

    if (!intern.student) {
      return res.status(500).json({ message: 'Student user record missing' });
    }

    const docs = intern.documents;

    /* =========================
       RESPONSE
    ========================= */
    return res.json({
      firstName: intern.student.firstName,
      fullName: `${intern.student.lastName}, ${intern.student.firstName} ${intern.student.mi || ''}`,
      studentId: intern.student.studentId,
      status: intern.status,
      remarks: intern.remarks || null,

      documents: [
        { name: 'Consent Form', uploaded: !!docs?.consent_form, file: docs?.consent_form },
        { name: 'Notarized Agreement', uploaded: !!docs?.notarized_agreement, file: docs?.notarized_agreement },
        { name: 'Portfolio', uploaded: !!docs?.portfolio, file: docs?.portfolio },
        { name: 'COR', uploaded: !!docs?.cor, file: docs?.cor },
        { name: 'Insurance', uploaded: !!docs?.insurance, file: docs?.insurance },
        { name: 'Medical Certificate', uploaded: !!docs?.medical_cert, file: docs?.medical_cert },
      ],

      companyDetails: intern.company
        ? {
            companyName: intern.company.name,
            supervisor: intern.company.supervisorName,
            startDate: intern.company.moaStart,
            endDate: intern.company.moaEnd,
          }
        : null,
    });
  } catch (error) {
    console.error('❌ INTERN DASHBOARD ERROR:', error);
    return res.status(500).json({ message: 'Failed to load intern dashboard' });
  }
};
