module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SupervisorEvaluation', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    intern_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    supervisor_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    company_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    academic_year: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    semester: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    comment: {
      type: DataTypes.TEXT,
    },
  });
};
