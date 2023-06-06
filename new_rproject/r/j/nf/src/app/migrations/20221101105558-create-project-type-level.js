'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_type_levels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_type_id: {
        type: Sequelize.INTEGER
      },
      level_title: {
        type: Sequelize.STRING
      },
      is_device_required: {
        type: Sequelize.INTEGER
      },
      is_sub_level: {
        type: Sequelize.INTEGER
      },
      is_child: {
        type: Sequelize.INTEGER
      },
      sequence: {
        type: Sequelize.INTEGER
      },
      parent_id: {
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
    await queryInterface.dropTable('project_type_levels');
  }
};