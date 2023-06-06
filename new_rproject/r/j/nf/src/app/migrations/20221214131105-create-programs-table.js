'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('programs_tables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Omega_id: {
        type: Sequelize.STRING
      },
      program_name: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.INTEGER
      },
      program_index: {
        type: Sequelize.INTEGER
      },
      cycleTypeIsCyclic: {
        type: Sequelize.BOOLEAN
      },
      hourlyStart: {
        type: Sequelize.INTEGER
      },
      hourlyEnd: {
        type: Sequelize.INTEGER
      },
      cyclePerDay: {
        type: Sequelize.INTEGER
      },
      endTimeMode: {
        type: Sequelize.BOOLEAN
      },
      measurementType: {
        type: Sequelize.INTEGER
      },
      allowedHoursStart: {
        type: Sequelize.INTEGER
      },
      cycleDayStartHour: {
        type: Sequelize.INTEGER
      },
      cycleIntervalDays: {
        type: Sequelize.INTEGER
      },
      cycleIntervalHours: {
        type: Sequelize.INTEGER
      },
      irrigationDays: {
        type: Sequelize.INTEGER
      },
      startDate: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.INTEGER
      },
      updated_by: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      valveId: {
        type: Sequelize.STRING
      },
      order: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.INTEGER
      },
      endTimeMode: {
        type: Sequelize.BOOLEAN
      },
      allowedHoursEnd: {
        type: Sequelize.INTEGER
      },
      cycleTypeHours: {
        type: Sequelize.JSON
      },
      project_id: {
        type: Sequelize.INTEGER
      },
      device_id: {
        type: Sequelize.INTEGER
      },
      bermad_program_id: {
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
    await queryInterface.dropTable('programs_tables');
  }
};