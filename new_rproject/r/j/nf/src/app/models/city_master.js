"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class city_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.country_master, {
        foreignKey: "country_id",
        as: "country_master",
      });
      this.belongsTo(models.state_master, {
        foreignKey: "state_id",
        as: "state_master",
      });
    }
  }
  city_master.init(
    {
      country_id: DataTypes.INTEGER,
      state_id: DataTypes.INTEGER,
      active: DataTypes.INTEGER,
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "City name already exist.!",
        },
        validate: {
          notNull: {
            msg: "City name should not be null!",
          },
          notEmpty: {
            msg: "Enter City name",
          },
          len: {
            args: [2, 30],
            msg: "Enter valid City!",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "city_master",
    }
  );
  return city_master;
};
