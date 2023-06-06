'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_access_management extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_access_management.init({
    user_type_id: DataTypes.INTEGER,
    menu_id: DataTypes.INTEGER,
    create_access: DataTypes.INTEGER,
    view_access: DataTypes.INTEGER,
    listing_access: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_access_management',
  });
  return user_access_management;
};