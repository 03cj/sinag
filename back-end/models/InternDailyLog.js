/* eslint-env node */
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class InternDailyLog extends Model {}

InternDailyLog.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    intern_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'interns',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    day_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    log_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    time_in: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    time_out: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    total_hours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: 'Auto-calculated from time_in and time_out',
    },

    tasks_accomplished: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    skills_enhanced: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    learning_applied: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    supervisor_status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      defaultValue: 'Pending',
    },

    adviser_status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      defaultValue: 'Pending',
    },

    supervisor_comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    adviser_comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'InternDailyLog',
    tableName: 'intern_daily_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
  },
);

module.exports = InternDailyLog;
