'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_devices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_id: {
        type: Sequelize.INTEGER
      },
      device_code: {
        type: Sequelize.STRING
      },
      omega_id: {
        type: Sequelize.STRING
      },
      device_name: {
        type: Sequelize.STRING
      },
      device_status: {
        type: Sequelize.INTEGER
      },
      location: {
        type: Sequelize.STRING
      },
      farmer_count: {
        type: Sequelize.INTEGER
      },
      active: {
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
    await queryInterface.dropTable('project_devices');
  }
};