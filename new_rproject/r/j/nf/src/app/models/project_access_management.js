"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class project_access_management extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  project_access_management.init(
    {
      user_id: DataTypes.INTEGER,
      project_id: DataTypes.INTEGER,
      access: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "project_access_management",
    }
  );
  return project_access_management;
};
