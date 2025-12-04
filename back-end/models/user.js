/* eslint-env node */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING(100), allowNull: false },
    lastName: { type: DataTypes.STRING(100), allowNull: false },
    mi: { type: DataTypes.STRING(50), allowNull: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'Coordinator' },
    contactNumber: { type: DataTypes.STRING(20), allowNull: true },
    department: { type: DataTypes.STRING(100), allowNull: true },
    employeeId: { type: DataTypes.STRING(50), allowNull: true },
    studentId: { type: DataTypes.STRING(50), allowNull: true },
  },
  {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  },
);

module.exports = User;
