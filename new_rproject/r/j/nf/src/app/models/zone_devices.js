"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class zone_devices extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.devices_master, {
        foreignKey: "device_id",
        as: "devices_master",
      });
    }
  }
  zone_devices.init(
    {
      project_id: DataTypes.INTEGER,
      zone_id: DataTypes.INTEGER,
      project_id: DataTypes.INTEGER,
      device_id: DataTypes.INTEGER,
      omega_id: DataTypes.STRING,
      device_count: DataTypes.INTEGER,
      latitude: DataTypes.NUMERIC,
      longitude: DataTypes.NUMERIC,
      active: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "zone_devices",
    }
  );
  return zone_devices;
};
