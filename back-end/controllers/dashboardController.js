/* eslint-env node */
const { fn, col, literal, Op } = require('sequelize');

const Intern = require('../models/interns');
const Company = require('../models/company');
const User = require('../models/user');

/* =========================
   GET PROGRAM FILTERS
   (FROM ADVISERS)
========================= */
exports.getAdviserPrograms = async (req, res, next) => {
  try {
    const advisers = await User.findAll({
      where: { role: 'Adviser' },
      attributes: ['program'],
      raw: true,
    });

    const programs = advisers
      .map((a) => a.program)
      .filter(Boolean);

    res.json(programs);
  } catch (err) {
    next(err);
  }
};

/* =========================
   GET INTERNS PER PROGRAM
========================= */
exports.getPrograms = async (req, res, next) => {
  try {
    // 1️⃣ Get adviser programs first
    const advisers = await User.findAll({
      where: { role: 'Adviser' },
      attributes: ['program'],
      raw: true,
    });

    const adviserPrograms = advisers
      .map((a) => a.program)
      .filter(Boolean);

    // Adviser restriction (logged-in adviser)
    let whereCondition = {
      status: ['Pending', 'Endorsed', 'Accepted', 'Completed'],
      program: { [Op.in]: adviserPrograms },
    };

    if (req.user.role === 'Adviser') {
      const adviser = await User.findByPk(req.user.id);
      if (adviser?.program) {
        whereCondition.program = adviser.program;
      }
    }

    const results = await Intern.findAll({
      attributes: ['program', [fn('COUNT', col('Intern.id')), 'count']],
      where: whereCondition,
      group: ['program'],
      order: [[literal('count'), 'DESC']],
      raw: true,
    });

    res.json(
      results.map((r) => ({
        program: r.program,
        count: Number(r.count),
      })),
    );
  } catch (err) {
    next(err);
  }
};

/* =========================
   GET INTERNS PER COMPANY
========================= */
exports.getCompanies = async (req, res, next) => {
  try {
    let whereCondition = {
      status: ['Pending', 'Endorsed', 'Accepted', 'Completed'],
    };

    // Adviser restriction
    if (req.user.role === 'Adviser') {
      const adviser = await User.findByPk(req.user.id);
      if (adviser?.program) {
        whereCondition.program = adviser.program;
      }
    }

    const results = await Intern.findAll({
      attributes: ['company_id', [fn('COUNT', col('Intern.id')), 'count']],
      include: [
        {
          model: Company,
          attributes: ['name'],
        },
      ],
      where: whereCondition,
      group: ['company_id', 'Company.id'],
      order: [[literal('count'), 'DESC']],
      raw: true,
    });

    res.json(
      results.map((r) => ({
        company: r['Company.name'] || 'Unassigned',
        count: Number(r.count),
      })),
    );
  } catch (err) {
    next(err);
  }
};

/* =========================
   KPI COUNTS
========================= */
exports.getKpis = async (req, res, next) => {
  try {
    let internWhere = {
      status: ['Pending', 'Endorsed', 'Accepted'],
    };

    // Adviser restriction
    if (req.user.role === 'Adviser') {
      const adviser = await User.findByPk(req.user.id);
      if (adviser?.program) {
        internWhere.program = adviser.program;
      }
    }

    const [activeInterns, activePrograms, partnerHTE] = await Promise.all([
      // Active interns
      Intern.count({ where: internWhere }),

      // Active programs = advisers count
      User.count({
        where: {
          role: 'Adviser',
          program: { [Op.ne]: null },
        },
      }),

      // Partner HTE
      Company.count(),
    ]);

    res.json({
      activeInterns,
      activePrograms,
      partnerHTE,
    });
  } catch (err) {
    next(err);
  }
};
