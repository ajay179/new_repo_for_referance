"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tahasil_master extends Model {
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
      this.belongsTo(models.city_master, {
        foreignKey: "city_id",
        as: "city_master",
      });
    }
  }
  tahasil_master.init(
    {
      country_id: DataTypes.INTEGER,
      state_id: DataTypes.INTEGER,
      city_id: DataTypes.INTEGER,
      tahasil_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "tahasil name already in use!",
        },
        validate: {
          notNull: {
            msg: "tahasil should not be null!",
          },
          notEmpty: {
            msg: "Enter tahasil name",
          },
          len: {
            args: [2, 30],
            msg: "Enter valid tahasil!",
          },
        },
      },
      active: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "tahasil_master",
    }
  );
  return tahasil_master;
};
