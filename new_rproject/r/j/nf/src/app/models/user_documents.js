'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_documents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_documents.init({
    user_id: DataTypes.INTEGER,
    document_type: DataTypes.INTEGER,
    document_title: DataTypes.STRING,
    document_path: DataTypes.STRING,
    active: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_documents',
  });
  return user_documents;
};