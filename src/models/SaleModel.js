const { DataTypes } = require("sequelize");
const database = require("../config/Database");
const SalespersonModel = require("./SalespersonModel");
const CustomerModel = require("./CustomerModel");
const ProductSale = require("./ProductSaleModel");

const Sale = database.define("Sale", {
    sale_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    sale_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    payment_method: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    observation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = Sale;
