"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class devices_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  devices_details.init(
    {
      device_id: DataTypes.STRING,
      type: DataTypes.INTEGER,
      input_id: DataTypes.STRING,
      name: DataTypes.STRING,
      unitOfMeasure: DataTypes.STRING,
      value: DataTypes.DECIMAL,
      input_index: DataTypes.STRING,
      flow: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "devices_details",
    }
  );
  return devices_details;
};
