/* eslint-env node */
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class InternDocuments extends Model {}

InternDocuments.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    intern_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
    },

    consent_form: DataTypes.STRING(255),
    notarized_agreement: DataTypes.STRING(255),
    portfolio: DataTypes.STRING(255),
    cor: DataTypes.STRING(255),
    insurance: DataTypes.STRING(255),
    medical_cert: DataTypes.STRING(255),

    uploaded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'InternDocuments',
    tableName: 'intern_documents',
    timestamps: false,
    underscored: true,
  },
);

module.exports = InternDocuments;
