const { DataTypes } = require("sequelize");
const database = require("../config/Database");
const User = require("./User");
const Category = require("./Category");

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

Salesperson.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
Salesperson.belongsTo(Category, { foreignKey: "category_id", onDelete: "SET NULL" });

module.exports = SalespersonModel;
