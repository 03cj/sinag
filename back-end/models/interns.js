/* eslint-env node */
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Intern extends Model {}

Intern.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    company_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },

    program: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Declined'),
      allowNull: false,
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

    remarks: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Intern',
    tableName: 'interns',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
  },
);

/* =========================
   ASSOCIATIONS (CRITICAL)
========================= */
const User = require('./user');
const Company = require('./company');
const InternDocuments = require('./internDocuments');

// Intern ↔ User
Intern.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Intern, { foreignKey: 'user_id' });

// Intern ↔ Documents
// ✅ CORRECT
Intern.hasMany(InternDocuments, { foreignKey: 'intern_id' });
InternDocuments.belongsTo(Intern, { foreignKey: 'intern_id' });

// Intern ↔ Company (HTE)
Intern.belongsTo(Company, { foreignKey: 'company_id' });
Company.hasMany(Intern, { foreignKey: 'company_id' });

module.exports = Intern;
