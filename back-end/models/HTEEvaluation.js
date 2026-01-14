/* eslint-env node */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HTEEvaluation = sequelize.define(
  'HTEEvaluation',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    intern_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    company_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    student_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    program: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    school_term: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    academic_year: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    evaluation_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    ratings: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    remarks: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    strengths: DataTypes.TEXT,
    improvements: DataTypes.TEXT,
    recommendations: DataTypes.TEXT,

    submitted_by: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    noted_by: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'hte_evaluations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  },
);

module.exports = HTEEvaluation;
