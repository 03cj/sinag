module.exports = (sequelize, DataTypes) => {
  const InternEvaluation = sequelize.define(
    'InternEvaluation',
    {
      internName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      section: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      hteName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      jobDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      totalScore: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      technicalDetails: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      recommendations: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      evaluator: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      designation: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      conforme: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'intern_evaluations',
      timestamps: true,
    },
  );

  // 🔗 Associations
  InternEvaluation.associate = (models) => {
    InternEvaluation.hasMany(models.InternEvaluationItem, {
      foreignKey: 'evaluationId',
      as: 'items',
      onDelete: 'CASCADE',
    });
  };

  return InternEvaluation;
};
