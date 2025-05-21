const { DataTypes } = require("sequelize");
const database = require("../config/Database");

const SheetData = database.define("SheetData", {
    col1: {
        type: DataTypes.STRING,
    },
    col2: {
        type: DataTypes.STRING,
    },
    col3: {
        type: DataTypes.STRING,
    },
});

module.exports = SheetData;