const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Load models the SAME WAY as app.js
const SupervisorEvaluation = require('../models/SupervisorEvaluation')(sequelize, DataTypes);

const SupervisorEvaluationItem = require('../models/SupervisorEvaluationItem')(sequelize, DataTypes);

exports.submitEvaluation = async (req, res) => {
  try {
    const { intern_id, company_id, academic_year, semester, comment, items } = req.body;

    // From auth middleware (JWT)
    const supervisor_id = req.user.id;

    // 1️⃣ Create main evaluation
    const evaluation = await SupervisorEvaluation.create({
      intern_id,
      supervisor_id,
      company_id,
      academic_year,
      semester,
      comment,
    });

    // 2️⃣ Map evaluation items
    const mappedItems = items.map((item) => ({
      evaluationId: evaluation.id, // ✅ MUST MATCH FK NAME
      section: item.section,
      indicator: item.indicator,
      rating: item.rating,
      remark: item.remark,
    }));

    // 3️⃣ Bulk insert items
    await SupervisorEvaluationItem.bulkCreate(mappedItems);

    return res.status(201).json({
      message: 'Supervisor evaluation submitted successfully',
    });
  } catch (error) {
    console.error('❌ Supervisor Evaluation Error:', error);
    return res.status(500).json({
      message: 'Submission failed',
    });
  }
};
