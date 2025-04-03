const { Sequelize } = require("sequelize");
require("dotenv").config();

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in .env file");
    }

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

  async connect() {
    try {
      await this.db.authenticate();
      await this.db.sync({ alter: true });
      console.log("Database connected successfully ✅");
      console.log("Database synced successfully ✅");
    } catch (error) {
      console.error("Database connection error ❌", error);
      process.exit(1);
    }
  }
}

const database = new Database();
database.connect();

module.exports = database.db;
