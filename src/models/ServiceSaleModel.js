const { DataTypes } = require("sequelize");
const database = require("../config/Database");

const ServiceSale = database.define("ServiceSales", {
    service_sale_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    service_price: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    total_sales: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    zoning: {
        type: DataTypes.STRING,
    },
});

module.exports = ServiceSale;
