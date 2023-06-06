'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class error_log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  error_log.init({
    payload: DataTypes.TEXT,
    error_code: DataTypes.INTEGER,
    error_msg: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'error_log',
  });
  return error_log;
};