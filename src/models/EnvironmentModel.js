const { DataTypes } = require("sequelize");
const db = require("../config/Database")

const Environment = db.define("Environment", {
    environment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = Environment;