'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class system_logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  system_logs.init({
    project_id: DataTypes.STRING,
    project_name: DataTypes.STRING,
    unit_id: DataTypes.STRING,
    unit_name: DataTypes.STRING,
    datetime: DataTypes.STRING,
    datetimelocal: DataTypes.STRING,
    line: DataTypes.STRING,
    serial: DataTypes.STRING,
    key: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'system_logs',
  });
  return system_logs;
};