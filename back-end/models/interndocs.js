/* eslint-env node */
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class InternDocs extends Model {}

InternDocs.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    docType: {
      type: DataTypes.ENUM(
        'Medical Certificate',
        'Resume / CV',
        'Insurance',
        'Certificate of Registration (COR)',
        'Good Moral Certificate',
      ),
      allowNull: false,
    },

    filePath: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      defaultValue: 'Pending',
    },

    remarks: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    uploaded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'InternDocs',
    tableName: 'intern_docs', // ✅ snake_case is safer
    timestamps: false,
    underscored: true,
  },
);

module.exports = InternDocs;
