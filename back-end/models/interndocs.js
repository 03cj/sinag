/* eslint-env node */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const InternDocs = sequelize.define(
  'InternDocs',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    docType: {
      type: DataTypes.ENUM(
        'Medical Certificate',
        'Resume / CV',
        'Insurance',
        'Certificate of Registration (COR)',
        'Good Moral Certificate'
      ),
      allowNull: false,
    },
    filePath: { type: DataTypes.STRING(255), allowNull: false },
    status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      defaultValue: 'Pending',
    },
    remarks: { type: DataTypes.STRING(255), allowNull: true },
    uploadedAt: {
      type: DataTypes.DATE,
      field: 'uploaded_at',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'interndocs',
    timestamps: false,
  }
);

// 🔗 Correct associations
InternDocs.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(InternDocs, { foreignKey: 'user_id' });

module.exports = InternDocs;
