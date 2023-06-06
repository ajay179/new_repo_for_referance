'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction_masters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaction_masters.init({
    transactionId: DataTypes.INTEGER,
    transactionCode: DataTypes.STRING,
    transactionName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transaction_masters',
  });
  return transaction_masters;
};