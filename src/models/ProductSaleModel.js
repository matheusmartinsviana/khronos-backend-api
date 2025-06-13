const { DataTypes } = require("sequelize");
const database = require("../config/Database");
const ProductModel = require("./ProductModel");
const ServiceModel = require("./ServiceModel");

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
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  zoning: {
    type: DataTypes.STRING,
  },
});

ProductSale.belongsTo(ProductModel, { foreignKey: "product_id" });
ProductSale.belongsTo(ServiceModel, { foreignKey: "service_id" });

module.exports = ProductSale;