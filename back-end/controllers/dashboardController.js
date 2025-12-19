/* eslint-env node */
const { fn, col, literal } = require('sequelize');

const Intern = require('../models/interns');
const Company = require('../models/company');

/* =========================
   GET INTERNS PER PROGRAM
========================= */
exports.getProgramStats = async (req, res, next) => {
  try {
    const results = await Intern.findAll({
      attributes: ['program', [fn('COUNT', col('Intern.id')), 'count']],
      where: {
        status: ['Pending', 'Endorsed', 'Accepted', 'Completed'],
      },
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
exports.getCompanyStats = async (req, res, next) => {
  try {
    const results = await Intern.findAll({
      attributes: ['company_id', [fn('COUNT', col('Intern.id')), 'count']],
      include: [
        {
          model: Company,
          attributes: ['name'],
        },
      ],
      where: {
        status: ['Pending', 'Endorsed', 'Accepted', 'Completed'],
      },
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
   GET KPI COUNTS
========================= */
exports.getKpis = async (req, res, next) => {
  try {
    const [activeInterns, activePrograms, partnerHTE] = await Promise.all([
      // Active interns
      Intern.count({
        where: {
          status: ['Pending', 'Endorsed', 'Accepted'],
        },
      }),

      // Distinct programs
      Intern.count({
        distinct: true,
        col: 'program',
      }),

      // Partner companies (HTE)
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
