const { DataTypes } = require("sequelize");
const database = require("../config/Database");

const ProductSale = database.define("ProductSales", {
  product_sale_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  total_sales: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  zoning: {
    type: DataTypes.STRING,
  },
});

module.exports = ProductSale;