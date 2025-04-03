const { DataTypes } = require("sequelize");
const database = require("../config/Database");
const Product = require("./Product");
const Sale = require("./Sale");

const ProductSaleModel = database.define("ProductSale", {
  product_sale_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
});

ProductSale.belongsTo(Product, { foreignKey: "product_id", onDelete: "CASCADE" });
ProductSale.belongsTo(Sale, { foreignKey: "sale_id", onDelete: "CASCADE" });

module.exports = ProductSaleModel;
