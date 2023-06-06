'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_master extends Model {
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
      this.belongsTo(models.project, {
        foreignKey: "project_selected",
        as: "project",
      });
    }
  }
  user_master.init({
    employee_code: DataTypes.STRING,
    user_type: DataTypes.INTEGER,
    gender_id: DataTypes.INTEGER,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
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
    pin: DataTypes.INTEGER,
    qualification: DataTypes.STRING,
    dob: DataTypes.DATE,
    joining_date: DataTypes.DATE,
    profile_pic: DataTypes.STRING,
    marital_status: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    project_selected: DataTypes.INTEGER,
    active: DataTypes.INTEGER,
    token: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_master',
  });
  return user_master;
};