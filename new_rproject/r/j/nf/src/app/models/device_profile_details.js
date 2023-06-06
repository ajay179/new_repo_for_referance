"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class device_profile_details extends Model {
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
  device_profile_details.init(
    {
      device_profile_id: DataTypes.INTEGER,
      device_id: DataTypes.INTEGER,
      omega_id: DataTypes.STRING,
      lat: DataTypes.DOUBLE,
      long: DataTypes.DOUBLE,
      active: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "device_profile_details",
    }
  );
  return device_profile_details;
};
