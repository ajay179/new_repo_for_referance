"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class devices_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      /* this.belongsTo(models.zone_devices, {
        foreignKey: "project_id",
        as: "zone_devices",
      });*/
      /* this.belongsTo(models.devices_master, {
        foreignKey: "project_id",
        as: "devices_master",
      });*/
    }
  }
  devices_master.init(
    {
      project_id: DataTypes.INTEGER,
      omega_id:
      {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Omega already exist.!",
        },
      },
      device_name: DataTypes.STRING,
      lat: DataTypes.DECIMAL,
      long: DataTypes.DECIMAL,
      active: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "devices_master",
    }
  );
  return devices_master;
};
