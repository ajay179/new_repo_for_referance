"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class programs_amount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  programs_amount.init(
    {
      program_id: DataTypes.INTEGER,
      omega_id: DataTypes.STRING,
      order: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      bermad_valve_id: DataTypes.STRING,
      valve_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "programs_amount",
    }
  );
  return programs_amount;
};
