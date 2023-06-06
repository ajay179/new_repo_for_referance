"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class document_type_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  document_type_master.init(
    {
      document_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
          msg: "Document type already in use!",
        },
        validate: {
          notNull: {
            msg: "Document type should not be null!",
          },
          notEmpty: {
            msg: "Enter Document type name",
          },
          len: {
            args: [2, 20],
            msg: "Enter valid Document type!",
          },
        },
      },
      active: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "document_type_master",
    }
  );
  return document_type_master;
};
