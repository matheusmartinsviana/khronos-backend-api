const { DataTypes } = require("sequelize");
const database = require("../config/Database");
const Category = require("./CategoryModel");

const ProductModel = database.define("Product", {
  product_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  zoning: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  product_type: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

ProductModel.belongsTo(Category, { foreignKey: "category_id", onDelete: "SET NULL" });

module.exports = ProductModel;