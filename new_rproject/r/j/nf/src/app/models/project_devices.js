"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class project_devices extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.devices_master, {
        foreignKey: "project_id",
        as: "devices_master",
      });

      /* this.belongsTo(models.devices_master, {
        foreignKey: "device_id",
        as: "devices_master",
      });*/
    }
  }
  project_devices.init(
    {
      project_id: DataTypes.INTEGER,
      device_code: DataTypes.STRING,
      device_id: DataTypes.INTEGER,
      device_name: {
        type: DataTypes.STRING,
        /* allowNull: false,
         unique: {
          msg: "Devices name already exist.!",
        },
        validate: {
          notNull: {
            msg: "Device name should not be null!",
          },
          notEmpty: {
            msg: "Enter Devices name",
          },
          len: {
            args: [2, 20],
            msg: "Enter valid Devices name.!",
          },
        },*/
      },
      device_status: DataTypes.INTEGER,
      location: DataTypes.STRING,
      farmer_count: DataTypes.INTEGER,
      active: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "project_devices",
    }
  );
  return project_devices;
};
