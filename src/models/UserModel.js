const { DataTypes } = require("sequelize");
const database = require("../config/Database");

const UserModel = database.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("salesperson", "admin", "viewer", "blocked"),
    allowNull: false,
  },
});

module.exports = UserModel;