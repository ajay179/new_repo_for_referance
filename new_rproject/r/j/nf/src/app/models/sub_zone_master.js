"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class sub_zone_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.sub_zone_devices, {
        foreignKey: "sub_zone_id",
        as: "sub_zone_devices",
      });

      this.belongsTo(models.devices_master, {
        foreignKey: "project_id",
        as: "devices_master",
      });

      this.belongsTo(models.zone_master, {
        foreignKey: "zone_id",
        as: "zone_master",
      });
    }
  }
  sub_zone_master.init(
    {
      zone_id: DataTypes.INTEGER,
      project_id: DataTypes.INTEGER,
      sub_zone_code: DataTypes.STRING,
      sub_zone_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Sub Zone name already in use!",
        },
        validate: {
          notNull: {
            msg: "Sub Zone name should not be null!",
          },
          notEmpty: {
            msg: "Enter Sub Zone name",
          },
          len: {
            args: [2, 20],
            msg: "Enter valid Sub Zone name.!",
          },
        },
      },
      latitude: DataTypes.DECIMAL,
      longitude: DataTypes.DECIMAL,
      area: DataTypes.DOUBLE,
      water_demand: DataTypes.DOUBLE,
      active: DataTypes.INTEGER,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "sub_zone_master",
    }
  );
  return sub_zone_master;
};
