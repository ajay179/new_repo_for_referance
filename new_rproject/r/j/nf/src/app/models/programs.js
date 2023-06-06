"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class programs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  programs.init(
    {
      omega_id: DataTypes.STRING,
      program_name: DataTypes.STRING,
      status: DataTypes.INTEGER,
      type: DataTypes.INTEGER,
      program_index: DataTypes.INTEGER,
      cycleTypeIsCyclic: DataTypes.BOOLEAN,
      hourlyStart: DataTypes.INTEGER,
      hourlyEnd: DataTypes.INTEGER,
      cyclePerDay: DataTypes.INTEGER,
      endTimeMode: DataTypes.BOOLEAN,
      measurementype: DataTypes.INTEGER,
      allowedHoursStart: DataTypes.INTEGER,
      cycleDayStartHour: DataTypes.INTEGER,
      cycleIntervalDays: DataTypes.INTEGER,
      cycleIntervalHours: DataTypes.INTEGER,
      irrigationDays: DataTypes.INTEGER,
      startDate: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
      description: DataTypes.STRING,
      valveId: DataTypes.STRING,
      order: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      endTimeMode: DataTypes.BOOLEAN,
      allowedHoursEnd: DataTypes.INTEGER,
      cycleTypeHours: DataTypes.JSON,
      project_id: DataTypes.INTEGER,
      device_id: DataTypes.INTEGER,
      bermad_program_id: DataTypes.STRING,
      program_status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "programs",
    }
  );
  return programs;
};
