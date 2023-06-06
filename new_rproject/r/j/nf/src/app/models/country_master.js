"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class country_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.city_master, {
        foreignKey: "country_id",
        as: "city_master",
      });
      this.hasMany(models.tahasil_master, {
        foreignKey: "country_id",
        as: "tahasil_master",
      });
      this.hasMany(models.village_master, {
        foreignKey: "country_id",
        as: "village_master",
      });
      this.hasMany(models.state_master, {
        foreignKey: "country_id",
        as: "state_master",
      });
    }
  }
  country_master.init(
    {
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Country name already exist.!",
        },
        validate: {
          notNull: {
            msg: "Country name should not be null!",
          },
          notEmpty: {
            msg: "Enter Country name",
          },
          len: {
            args: [2, 30],
            msg: "Enter valid Country!",
          },
        },
      },
      active: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "country_master",
    }
  );
  // country_master.addHook('beforeCreate', (country_master, options) => {
  //   // console.log(country_master.country.toLowerCase());
  //   country_master.country = country_master.country.toLowerCase();
  // });

  return country_master;
};
