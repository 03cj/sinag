const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const InternEvaluation = require('../models/InternEvaluation')(sequelize, DataTypes);
const InternEvaluationItem = require('../models/InternEvaluationItem')(sequelize, DataTypes);

// 🔗 Relationships
InternEvaluation.hasMany(InternEvaluationItem, {
  foreignKey: 'evaluationId',
  onDelete: 'CASCADE',
});
InternEvaluationItem.belongsTo(InternEvaluation, {
  foreignKey: 'evaluationId',
});

exports.createEvaluation = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { ratings, totalScore, ...evaluationData } = req.body;

    // 1️⃣ Save evaluation
    const evaluation = await InternEvaluation.create({ ...evaluationData, totalScore }, { transaction });

    // 2️⃣ Save item ratings (with remarks)
    const rows = ratings.map((score, index) => ({
      evaluationId: evaluation.id,
      category: index < 5 ? 'CHARACTER' : 'COMPETENCE',
      itemText: `Indicator ${index + 1}`,
      maxScore: index < 5 ? 10 : 5,
      score: Number(score) || 0,
    }));

    await InternEvaluationItem.bulkCreate(rows, { transaction });

    await transaction.commit();

    res.status(201).json({ message: 'Evaluation saved successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: 'Failed to save evaluation' });
  }
};
