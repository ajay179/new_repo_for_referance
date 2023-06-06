'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('live_monitorings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_id: {
        type: Sequelize.INTEGER
      },
      omega_id: {
        type: Sequelize.STRING
      },
      device_id: {
        type: Sequelize.INTEGER
      },
      isonline: {
        type: Sequelize.BOOLEAN
      },
      digital_inputs: {
        type: Sequelize.TEXT
      },
      valves: {
        type: Sequelize.TEXT
      },
      watermeter: {
        type: Sequelize.TEXT
      },
      programs: {
        type: Sequelize.TEXT
      },
      analogs: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('live_monitorings');
  }
};