/* eslint-env node */
const { fn, col, literal, Op } = require('sequelize');
const { Intern, Company, User } = require('../models');

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

    const programs = advisers.map((a) => a.program).filter(Boolean);

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
    const advisers = await User.findAll({
      where: { role: 'Adviser' },
      attributes: ['program'],
      raw: true,
    });

    const adviserPrograms = advisers.map((a) => a.program).filter(Boolean);

    let whereCondition = {
      status: ['Pending', 'Approved', 'Declined'],
      program: { [Op.in]: adviserPrograms },
    };

    // Adviser restriction
    if (req.user.role === 'adviser') {
      if (!req.user.program) {
        return res.json([]);
      }
      whereCondition.program = req.user.program;
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
      status: ['Pending', 'Approved', 'Declined'],
    };

    // Adviser restriction
    if (req.user.role === 'adviser') {
      if (!req.user.program) {
        return res.json([]);
      }
      whereCondition.program = req.user.program;
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
   (Coordinator + Adviser)
========================= */
exports.getKpis = async (req, res, next) => {
  try {
    let internWhere = {
      status: ['Pending', 'Approved', 'Declined'],
    };

    // Adviser restriction
    if (req.user.role === 'adviser' && req.user.program) {
      internWhere.program = req.user.program;
    }

    const [activeInterns, activePrograms, partnerHTE] = await Promise.all([
      // Active interns
      Intern.count({ where: internWhere }),

      // DISTINCT programs
      User.count({
        where: {
          role: 'Adviser',
          program: { [Op.ne]: null },
        },
        distinct: true,
        col: 'program',
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

/* =========================
   ADVISER-SPECIFIC KPI
   (DashboardA)
========================= */
exports.getAdviserKpis = async (req, res, next) => {
  try {
    if (req.user.role !== 'adviser') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (!req.user.program) {
      return res.json({
        activeInterns: 0,
        activeProgram: null,
        partnerHTE: 0,
      });
    }

    const activeInterns = await Intern.count({
      where: {
        program: req.user.program,
        status: ['Pending', 'Approved', 'Declined'],
      },
    });

    const partnerHTE = await Company.count();

    res.json({
      activeInterns,
      activeProgram: req.user.program,
      partnerHTE,
    });
  } catch (err) {
    next(err);
  }
};
