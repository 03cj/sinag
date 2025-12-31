/* eslint-env node */
const User = require('../models/user');
const Intern = require('../models/interns');
const Company = require('../models/company');
const InternDocuments = require('../models/internDocuments');

exports.getInternDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const intern = await Intern.findOne({
      where: { user_id: userId },
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'mi', 'studentId'] },
        { model: Company, required: false, attributes: ['name', 'supervisorName', 'moaStart', 'moaEnd'] },
      ],
    });

    if (!intern) {
      return res.status(404).json({ message: 'Intern record not found' });
    }

    const documents = await InternDocuments.findOne({
      where: { intern_id: intern.id },
    });

    res.json({
      firstName: intern.User.firstName,
      fullName: `${intern.User.lastName}, ${intern.User.firstName} ${intern.User.mi || ''}`,
      studentId: intern.User.studentId,
      status: intern.status,
      remarks: intern.remarks || null,

      documents: [
        { name: 'Consent Form', uploaded: !!documents?.consent_form, file: documents?.consent_form },
        {
          name: 'Notarized Agreement',
          uploaded: !!documents?.notarized_agreement,
          file: documents?.notarized_agreement,
        },
        { name: 'Portfolio', uploaded: !!documents?.portfolio, file: documents?.portfolio },
        { name: 'COR', uploaded: !!documents?.cor, file: documents?.cor },
        { name: 'Insurance', uploaded: !!documents?.insurance, file: documents?.insurance },
        { name: 'Medical Certificate', uploaded: !!documents?.medical_cert, file: documents?.medical_cert },
      ],

      companyDetails: intern.Company
        ? {
            companyName: intern.Company.name,
            supervisor: intern.Company.supervisorName,
            startDate: intern.Company.moaStart,
            endDate: intern.Company.moaEnd,
          }
        : null,
    });
  } catch (err) {
    console.error('❌ INTERN DASHBOARD ERROR:', err);
    next(err);
  }
};
