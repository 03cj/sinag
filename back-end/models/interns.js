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
        model: 'users', // 👈 MUST MATCH TABLE NAME
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
      type: DataTypes.ENUM(
        'Pending',
        'Endorsed',
        'Accepted',
        'Completed',
        'Rejected',
      ),
      defaultValue: 'Pending',
    },

    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    hours_required: DataTypes.INTEGER,
    hours_completed: DataTypes.INTEGER,
    remarks: DataTypes.STRING(255),
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

module.exports = Intern;
