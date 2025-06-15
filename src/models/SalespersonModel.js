const { DataTypes } = require("sequelize");
const database = require("../config/Database");
const User = require("./UserModel");
const Category = require("./CategoryModel");

const SalespersonModel = database.define(
  "Salesperson",
  {
    seller_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sales: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    commission: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: "user_id",
      },
    },
  },
  {
    timestamps: false,
    tableName: "Salesperson",
  }
);

module.exports = SalespersonModel;
