'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_type.init({
    user_type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "User type already exist.!",
      },
      validate: {
        notNull: {
          msg: "User type should not be null!",
        },
        notEmpty: {
          msg: "Enter User type",
        },
        len: {
          args: [2, 20],
          msg: "Enter valid User type.!",
        },
      },
    },
    active: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_type',
  });
  return user_type;
};