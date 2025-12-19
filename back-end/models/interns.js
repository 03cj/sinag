/* eslint-env node */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Intern = sequelize.define(
  'Intern',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    company_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },

    program: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM('Pending', 'Endorsed', 'Accepted', 'Completed', 'Rejected'),
      defaultValue: 'Pending',
    },

    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    hours_required: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    hours_completed: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    remarks: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'interns',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  },
);

module.exports = Intern;
