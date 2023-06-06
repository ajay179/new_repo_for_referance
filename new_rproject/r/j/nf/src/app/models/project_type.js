'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class project_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  project_type.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Project type already exist.!",
      },
      validate: {
        notNull: {
          msg: "Project type should not be null!",
        },
        notEmpty: {
          msg: "Enter Project type",
        },
        len: {
          args: [2, 20],
          msg: "Enter valid Project type.!",
        },
      },
    },
    active: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'project_type',
  });
  return project_type;
};