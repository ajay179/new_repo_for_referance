'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class project_type_level extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.project_type, {
        foreignKey: "project_type_id",
        as: "project_type",
      });
      this.hasMany(models.project_type_level, {
        foreignKey: "parent_id",
        as: "ptl2",
      });
      this.belongsTo(models.project_type_level, {
        foreignKey: "id",
        as: "ptl1",
      });
    }
  }
  project_type_level.init({
    project_type_id: DataTypes.INTEGER,
    level_title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Level title already exist.!",
      },
      validate: {
        notNull: {
          msg: "Level title should not be null!",
        },
        notEmpty: {
          msg: "Enter Level title",
        },
        len: {
          args: [2, 20],
          msg: "Enter valid Level title.!",
        },
      },
    },
    is_device_required: DataTypes.INTEGER,
    is_sub_level: DataTypes.INTEGER,
    is_child: DataTypes.INTEGER,
    sequence: DataTypes.INTEGER,
    parent_id: DataTypes.INTEGER,
    active: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'project_type_level',
  });
  return project_type_level;
};