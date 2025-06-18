const { Sequelize } = require("sequelize");

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
require("dotenv").config({ path: envFile });

class Database {
  constructor() {
    this.init();
  }

  init() {
    const isTestEnv = process.env.NODE_ENV === "test";
    const isProduction = process.env.NODE_ENV === "production";

    if (process.env.DATABASE_URL && isProduction) {
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
    } else {
      this.db = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT || 5432,
          dialect: "postgres",
          logging: false,
        }
      );
    }
  }

  async connect() {
    try {
      await this.db.authenticate();
      await this.db.sync({ alter: true }); // ou { force: true } nos testes
      if (process.env.NODE_ENV === "test") {
        await this.db.sync({ force: true }); // Força a sincronização no ambiente de testes
      }
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
