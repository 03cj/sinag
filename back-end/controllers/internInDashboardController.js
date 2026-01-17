'use strict';

const { Intern, User, Company } = require('../models');

exports.getInterns = async (req, res, next) => {
  try {
    const interns = await Intern.findAll({
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'mi', 'email', 'studentId', 'program'],
        },
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'email', 'supervisorName'],
          required: false,
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return res.json(interns);
  } catch (err) {
    console.error('❌ GET INTERNS ERROR:', err);
    return res.status(500).json({ message: 'Failed to fetch interns' });
  }
};
