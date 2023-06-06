'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.farmer_master, {
        foreignKey: "farmer_id",
        as: "farmer_master",
      });
    }
  }
  feedback.init({
    project_id: DataTypes.INTEGER,
    farmer_id: DataTypes.INTEGER,
    feedback: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
    active: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'feedback',
  });
  return feedback;
};