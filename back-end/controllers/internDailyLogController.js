'use strict';

const { InternDailyLog, Intern } = require('../models');

exports.createDailyLog = async (req, res) => {
  try {
    const { log_date, time_in, time_out, tasks_accomplished, skills_enhanced, learning_applied } = req.body;

    /* =========================
       VALIDATION
    ========================= */
    if (!log_date || !time_in || !time_out || !tasks_accomplished) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    /* =========================
       RESOLVE INTERN (AUTHORITY)
    ========================= */
    const intern = await Intern.findOne({
      where: { user_id: req.user.id },
    });

    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    /* =========================
       AUTO DAY NUMBER
    ========================= */
    const day_no = (await InternDailyLog.count({ where: { intern_id: intern.id } })) + 1;

    /* =========================
       PREVENT DUPLICATE DATE
    ========================= */
    const exists = await InternDailyLog.findOne({
      where: {
        intern_id: intern.id,
        log_date,
      },
    });

    if (exists) {
      return res.status(409).json({ message: 'Daily log already exists for this date' });
    }

    /* =========================
       CALCULATE HOURS
    ========================= */
    const [inH, inM] = time_in.split(':').map(Number);
    const [outH, outM] = time_out.split(':').map(Number);

    let start = inH * 60 + inM;
    let end = outH * 60 + outM;
    if (end < start) end += 24 * 60;

    const total_hours = Number(((end - start) / 60).toFixed(2));

    /* =========================
       CREATE LOG
    ========================= */
    const log = await InternDailyLog.create({
      intern_id: intern.id,
      day_no,
      log_date,
      time_in,
      time_out,
      total_hours,
      tasks_accomplished,
      skills_enhanced,
      learning_applied,
    });

    return res.status(201).json(log);
  } catch (err) {
    console.error('❌ CREATE DAILY LOG ERROR:', err);
    return res.status(500).json({ message: 'Failed to create daily log' });
  }
};

exports.getDailyLogs = async (req, res) => {
  try {
    const intern = await Intern.findOne({
      where: { user_id: req.user.id },
    });

    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    const logs = await InternDailyLog.findAll({
      where: { intern_id: intern.id },
      order: [['log_date', 'DESC']],
    });

    return res.json(logs);
  } catch (err) {
    console.error('❌ GET DAILY LOGS ERROR:', err);
    return res.status(500).json({ message: 'Failed to fetch daily logs' });
  }
};

exports.getInternDailyLogsForAdviser = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('📝 Fetching logs for intern_id:', id);

    /* =========================
       FETCH LOGS FOR SPECIFIC INTERN
    ========================= */
    const logs = await InternDailyLog.findAll({
      where: { intern_id: id },
      order: [['log_date', 'DESC']],
    });

    console.log('✅ Found logs:', logs.length);

    return res.json(logs);
  } catch (err) {
    console.error('❌ GET INTERN DAILY LOGS ERROR:', err);
    return res.status(500).json({ message: 'Failed to fetch daily logs' });
  }
};

exports.approveLogByAdviser = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { adviser_status, adviser_comment } = req.body;

    console.log('📝 Approving log:', reportId, 'Status:', adviser_status);

    /* =========================
       VALIDATION
    ========================= */
    if (!adviser_status) {
      return res.status(400).json({ message: 'adviser_status is required' });
    }

    /* =========================
       FIND AND UPDATE LOG
    ========================= */
    const log = await InternDailyLog.findByPk(reportId);

    if (!log) {
      return res.status(404).json({ message: 'Daily log not found' });
    }

    await log.update({
      adviser_status,
      adviser_comment: adviser_comment || null,
    });

    console.log('✅ Log approved successfully');

    return res.json({
      message: 'Log approved successfully',
      log,
    });
  } catch (err) {
    console.error('❌ APPROVE LOG ERROR:', err);
    return res.status(500).json({ message: 'Failed to approve log' });
  }
};
