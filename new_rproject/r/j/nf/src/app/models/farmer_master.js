"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class farmer_master extends Model {
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
      this.belongsTo(models.village_master, {
        foreignKey: "village_id",
        as: "village_master",
      });
      this.belongsTo(models.tahasil_master, {
        foreignKey: "tahasil_id",
        as: "tahasil_master",
      });
    }
  }
  farmer_master.init(
    {
      omega_id: DataTypes.INTEGER,
      farmer_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Farmer id already in use!",
        },
        validate: {
          notNull: {
            msg: "Please enter Farmer id",
          },
          notEmpty: {
            msg: "Please enter Farmer id",
          },
        },
      },
      project_id: DataTypes.INTEGER,
      farmer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobile_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Mobile number already in use!",
        },
        validate: {
          notNull: {
            msg: "Mobile number should not be null!",
          },
          notEmpty: {
            msg: "Enter Mobile number",
          },
          len: {
            args: [2, 12],
            msg: "Enter valid Mobile number!",
          },
        },
      },
      email_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email Id already in use!",
        },
        validate: {
          notNull: {
            msg: "Email Id should not be null!",
          },
          notEmpty: {
            msg: "Enter Email Id ",
          },
          isEmail: {
            msg: "Enter valid Email id.!",
          },
        },
      },
      country_id: DataTypes.INTEGER,
      state_id: DataTypes.INTEGER,
      city_id: DataTypes.INTEGER,
      tahasil_id: DataTypes.INTEGER,
      village_id: DataTypes.INTEGER,
      address: DataTypes.STRING,
      water_demand: DataTypes.DOUBLE,
      cultivated_area: DataTypes.DOUBLE,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      pincode: DataTypes.INTEGER,
      active: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
      valve_index: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "farmer_master",
    }
  );
  return farmer_master;
};
