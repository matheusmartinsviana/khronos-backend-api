const { DataTypes } = require("sequelize");
const database = require("../config/Database");
const User = require("./UserModel");
const Category = require("./CategoryModel");

const SalespersonModel = database.define("Salesperson", {
  seller_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sales: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
});

module.exports = SalespersonModel;
