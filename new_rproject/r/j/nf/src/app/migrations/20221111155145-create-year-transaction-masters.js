'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('year_transaction_masters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fyMasterId: {
        type: Sequelize.INTEGER
      },
      transactionMasterId: {
        type: Sequelize.INTEGER
      },
      transactionSeries: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.INTEGER
      },
      seriesStartNo: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('year_transaction_masters');
  }
};