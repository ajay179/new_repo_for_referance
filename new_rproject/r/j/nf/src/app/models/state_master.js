"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class state_master extends Model {
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
      this.hasMany(models.city_master, {
        foreignKey: "state_id",
        as: "city_master",
      });
      this.hasMany(models.tahasil_master, {
        foreignKey: "state_id",
        as: "tahasil_master",
      });
    }
  }
  state_master.init(
    {
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      //  DataTypes.INTEGER,
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "state already in use!",
        },
        validate: {
          notNull: {
            msg: "state should not be null!",
          },
          notEmpty: {
            msg: "Enter state name",
          },
          len: {
            args: [2, 30],
            msg: "Enter valid state!",
          },
        },
      },
      // DataTypes.STRING,
      active: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "state_master",
    }
  );
  return state_master;
};
