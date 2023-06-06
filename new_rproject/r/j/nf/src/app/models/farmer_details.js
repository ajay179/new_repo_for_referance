"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class farmer_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  farmer_details.init(
    {
      farmer_id: DataTypes.INTEGER,
      field_id: DataTypes.STRING,
      khasara_number: DataTypes.STRING,
      cultivated_area: DataTypes.INTEGER,
      water_demand: DataTypes.INTEGER,
      crops: DataTypes.STRING,
      address: DataTypes.STRING,
      device_id: DataTypes.INTEGER,
      valve_id: DataTypes.INTEGER,
      device_relationship: DataTypes.INTEGER,
      device_relationship_referance_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "farmer_details",
    }
  );
  return farmer_details;
};
