/* eslint-env node */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define(
  'Company',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    address: { type: DataTypes.STRING(255), allowNull: false },
    natureOfBusiness: { type: DataTypes.STRING(255), allowNull: false },
    supervisorName: { type: DataTypes.STRING(255), allowNull: false },
    moaStart: { type: DataTypes.DATEONLY, allowNull: false },
    moaEnd: { type: DataTypes.DATEONLY, allowNull: false },
    moaFile: { type: DataTypes.STRING(255), allowNull: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
  },
  {
    tableName: 'companies',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  },
);

module.exports = Company;
