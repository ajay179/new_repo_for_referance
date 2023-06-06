'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class project_type_level_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.project_type_level, {
        foreignKey: "project_type_level_id",
        as: "project_type_level",
      });
    }
  }
  project_type_level_details.init({
    project_type_level_id: DataTypes.INTEGER,
    title: DataTypes.INTEGER,
    is_device_required: DataTypes.INTEGER,
    is_child: DataTypes.INTEGER,
    parent_id: DataTypes.INTEGER,
    active: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'project_type_level_details',
  });
  return project_type_level_details;
};