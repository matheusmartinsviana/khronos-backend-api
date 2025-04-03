const { DataTypes } = require("sequelize");
const database = require("../config/Database");

const CategoryModel = database.define("Category", {
    category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

module.exports = CategoryModel;