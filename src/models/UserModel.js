const database = require("../config/Database");

class UserModel {
  constructor() {
    this.model = database.db.define("users", {
      id: {
        type: database.db.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: database.db.Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: database.db.Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // Valida se o email tem o formato correto
        },
      },
      password: {
        type: database.db.Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: database.db.Sequelize.ENUM("admin", "viewer", "blocked", "salesperson"),
        allowNull: false,
      },
      // accessCode: {
      //   type: database.db.Sequelize.STRING,
      //   allowNull: true,
      // },
      // accessCodeExpiration: {
      //   type: database.db.Sequelize.DATE,
      //   allowNull: true,
      // },
    });
  }
}

module.exports = new UserModel().model;