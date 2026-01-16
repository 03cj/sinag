// controllers/internDailyLogController.js
const InternDailyLog = require('../models/InternDailyLog');

exports.createDailyLog = async (req, res) => {
  try {
    const { intern_id, day_no, log_date, time_in, time_out, tasks_accomplished, skills_enhanced, learning_applied } =
      req.body;

    // Required fields
    if (!intern_id || !day_no || !log_date || !time_in || !time_out || !tasks_accomplished) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Prevent duplicate day per intern
    const exists = await InternDailyLog.findOne({
      where: { intern_id, day_no },
    });

    if (exists) {
      return res.status(409).json({ message: 'Daily log already exists for this day' });
    }

    // Calculate total hours (SERVER AUTHORITY)
    const [inH, inM] = time_in.split(':').map(Number);
    const [outH, outM] = time_out.split(':').map(Number);

    let start = inH * 60 + inM;
    let end = outH * 60 + outM;
    if (end < start) end += 24 * 60;

    const total_hours = ((end - start) / 60).toFixed(2);

    const log = await InternDailyLog.create({
      intern_id,
      day_no,
      log_date,
      time_in,
      time_out,
      total_hours,
      tasks_accomplished,
      skills_enhanced,
      learning_applied,
    });

    res.status(201).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
