const { Sequelize } = require("sequelize");
require("dotenv").config();

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.db = new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });
  }
}

module.exports = new Database();