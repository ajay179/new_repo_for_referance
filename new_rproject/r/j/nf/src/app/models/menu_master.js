'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class menu_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  menu_master.init({
    menu_desc: DataTypes.STRING,
    menu_url: DataTypes.STRING,
    parent_id: DataTypes.INTEGER,
    sequence_no: DataTypes.INTEGER,
    active: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'menu_master',
  });
  return menu_master;
};