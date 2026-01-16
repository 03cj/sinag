'use strict';

module.exports = (sequelize, DataTypes) => {
  const Intern = sequelize.define(
    'Intern',
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
      adviser_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      company_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      program: DataTypes.STRING(50),
      status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Declined'),
        defaultValue: 'Pending',
      },
      start_date: DataTypes.DATEONLY,
      end_date: DataTypes.DATEONLY,
      required_hours: DataTypes.INTEGER,
      remarks: DataTypes.STRING(255),
    },
    {
      tableName: 'interns',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
      underscored: true,
    },
  );

  Intern.associate = (models) => {
    Intern.belongsTo(models.User, { foreignKey: 'user_id' });
    Intern.belongsTo(models.User, { foreignKey: 'adviser_id', as: 'adviser' });
    Intern.belongsTo(models.Company, { foreignKey: 'company_id' });

    Intern.hasOne(models.InternDocuments, { foreignKey: 'intern_id' });
    Intern.hasOne(models.InternEvaluation, {
      foreignKey: 'intern_id',
      as: 'evaluation',
    });
  };
  Intern.associate = (models) => {
    // Intern ↔ User (Student)
    Intern.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'student',
    });

    // Intern ↔ User (Adviser)
    Intern.belongsTo(models.User, {
      foreignKey: 'adviser_id',
      as: 'adviser',
    });

    // Intern ↔ Company
    Intern.belongsTo(models.Company, {
      foreignKey: 'company_id',
    });
  };

  return Intern;
};
