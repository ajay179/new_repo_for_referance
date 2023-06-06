"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class device_profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.device_profile_details, {
        foreignKey: "device_profile_id",
        as: "device_profile_details",
      });

      this.belongsTo(models.devices_master, {
        foreignKey: "project_id",
        as: "devices_master",
      });
      this.belongsTo(models.zone_master, {
        foreignKey: "zone_id",
        as: "zone_master",
      });
      this.belongsTo(models.sub_zone_master, {
        foreignKey: "sub_zone_id",
        as: "sub_zone_master",
      });
    }
  }
  device_profile.init(
    {
      project_id: DataTypes.INTEGER,
      assignment_type: DataTypes.INTEGER,
      zone_id: DataTypes.INTEGER,
      sub_zone_id: DataTypes.INTEGER,
      device_name: DataTypes.STRING,
      lat: DataTypes.DOUBLE,
      long: DataTypes.DOUBLE,
      device_profile_code: DataTypes.STRING,
      active: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "device_profile",
    }
  );
  return device_profile;
};
