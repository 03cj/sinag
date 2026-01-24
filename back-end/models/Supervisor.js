const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Supervisor = sequelize.define(
    'Supervisor',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      company_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id',
        },
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'supervisors',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );

  Supervisor.associate = (models) => {
    Supervisor.belongsTo(models.Company, { foreignKey: 'company_id' });
    Supervisor.hasMany(models.Intern, { foreignKey: 'supervisor_id' });
  };

  return Supervisor;
};
