const { DataTypes } = require("sequelize")
const database = require("../config/Database")

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
  code: {
    type: DataTypes.STRING,
    allowNull: true,
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
  observation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  segment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Cloudinary URL of the product image",
  },
  image_public_id: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Cloudinary public ID for image management",
  },
  sales_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    comment: "Number of times the product has been sold",
  },
})

module.exports = ProductModel
