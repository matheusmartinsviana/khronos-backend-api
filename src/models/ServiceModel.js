const { DataTypes } = require("sequelize");
const database = require("../config/Database");
const Category = require("./CategoryModel");

const ServiceModel = database.define("Service", {
  service_id: {
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
});


module.exports = ServiceModel;