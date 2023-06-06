"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.project_type, {
        foreignKey: "project_type_id",
        as: "project_type",
      });

      this.hasMany(models.project_devices, {
        foreignKey: "project_id",
        as: "project_devices",
      });

      /* this.belongsTo(models.devices_master, {
        foreignKey: "id",
        as: "devices_master",
      });*/
    }
  }
  project.init(
    {
      project_type_id: DataTypes.INTEGER,
      project_code: DataTypes.STRING,
      project_name: DataTypes.STRING,
      client: DataTypes.STRING,
      contractor: DataTypes.STRING,
      project_details: DataTypes.STRING,
      profile_pic: DataTypes.STRING,
      active: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "project",
    }
  );
  return project;
};
