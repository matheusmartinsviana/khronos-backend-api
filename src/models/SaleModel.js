const { DataTypes } = require("sequelize");
const database = require("../config/Database");
const Salesperson = require("./Salesperson");
const Customer = require("./Customer");

const SaleModel = database.define("Sale", {
    sale_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

Sale.belongsTo(Salesperson, { foreignKey: "seller_id", onDelete: "CASCADE" });
Sale.belongsTo(Customer, { foreignKey: "customer_id", onDelete: "CASCADE" });

module.exports = SaleModel;
