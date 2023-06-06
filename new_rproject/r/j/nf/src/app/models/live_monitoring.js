'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class live_monitoring extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  live_monitoring.init({
    project_id: DataTypes.INTEGER,
    omega_id: DataTypes.STRING,
    device_id: DataTypes.STRING,
    isonline: DataTypes.BOOLEAN,
    digital_inputs: DataTypes.JSON,
    valves: DataTypes.JSON,
    watermeter: DataTypes.JSON,
    programs: DataTypes.JSON,
    analogs: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'live_monitoring',
  });
  return live_monitoring;
};