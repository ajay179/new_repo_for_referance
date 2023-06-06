'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('farmer_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      farmer_id: {
        type: Sequelize.INTEGER
      },
      field_id: {
        type: Sequelize.INTEGER
      },
      khasara_number: {
        type: Sequelize.STRING
      },
      cultivated_area: {
        type: Sequelize.INTEGER
      },
      water_demand: {
        type: Sequelize.INTEGER
      },
      crops: {
        type: Sequelize.STRING
      },
      device_id: {
        type: Sequelize.INTEGER
      },
      valve_id: {
        type: Sequelize.INTEGER
      },
      device_relationship: {
        type: Sequelize.INTEGER
      },
      device_relationship_referance_id: {
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
    await queryInterface.dropTable('farmer_details');
  }
};