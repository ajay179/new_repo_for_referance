"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class zone_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.project, {
        foreignKey: "project_id",
        as: "project",
      });

      this.hasMany(models.zone_devices, {
        foreignKey: "zone_id",
        as: "zone_devices",
      });

      this.belongsTo(models.devices_master, {
        foreignKey: "project_id",
        as: "devices_master",
      });
      /*
      this.belongsToMany(models.zone_devices, {
        through: models.devices_master,
      });*/
    }
  }
  zone_master.init(
    {
      zone_code: DataTypes.INTEGER,
      project_id: DataTypes.INTEGER,
      zone_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Zone name already in use!",
        },
        validate: {
          notNull: {
            msg: "Zone name should not be null!",
          },
          notEmpty: {
            msg: "Enter Zone name",
          },
          len: {
            args: [2, 20],
            msg: "Enter valid Zone name.!",
          },
        },
      },
      farmer_count: DataTypes.INTEGER,
      field_count: DataTypes.INTEGER,
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
      modelName: "zone_master",
    }
  );
  return zone_master;
};
