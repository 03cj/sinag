/* eslint-env node */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED, // ✅ FIXED
      autoIncrement: true,
      primaryKey: true,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    mi: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    studentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    program: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    guardian: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    resetCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    resetCodeExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    /* FORCE PASSWORD CHANGE */
    forcePasswordChange: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
);
User.associate = (models) => {
  // User ↔ Intern (Student account)
  User.hasOne(models.Intern, {
    foreignKey: 'user_id',
    as: 'internProfile',
  });

  // User ↔ Intern (Adviser supervises interns)
  User.hasMany(models.Intern, {
    foreignKey: 'adviser_id',
    as: 'advisees',
  });

  // User ↔ SupervisorEvaluation (Supervisor role)
  User.hasMany(models.SupervisorEvaluation, {
    foreignKey: 'supervisor_id',
  });
};

module.exports = User;
