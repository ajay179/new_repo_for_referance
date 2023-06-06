'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class year_transaction_masters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  year_transaction_masters.init({
    fyMasterId: DataTypes.INTEGER,
    transactionMasterId: DataTypes.INTEGER,
    transactionSeries: DataTypes.STRING,
    active: DataTypes.INTEGER,
    seriesStartNo: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'year_transaction_masters',
  });
  return year_transaction_masters;
};