'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('system_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_id: {
        type: Sequelize.STRING
      },
      project_name: {
        type: Sequelize.STRING
      },
      unit_id: {
        type: Sequelize.STRING
      },
      unit_name: {
        type: Sequelize.STRING
      },
      datetime: {
        type: Sequelize.STRING
      },
      datetimelocal: {
        type: Sequelize.STRING
      },
      line: {
        type: Sequelize.STRING
      },
      serial: {
        type: Sequelize.STRING
      },
      key: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('system_logs');
  }
};