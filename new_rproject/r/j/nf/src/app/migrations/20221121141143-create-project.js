'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_type: {
        type: Sequelize.INTEGER
      },
      project_code: {
        type: Sequelize.STRING
      },
      project_name: {
        type: Sequelize.STRING
      },
      client: {
        type: Sequelize.STRING
      },
      contractor: {
        type: Sequelize.STRING
      },
      project_details: {
        type: Sequelize.STRING
      },
      omega_id: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.INTEGER
      },
      created_by: {
        type: Sequelize.INTEGER
      },
      updated_by: {
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
    await queryInterface.dropTable('projects');
  }
};