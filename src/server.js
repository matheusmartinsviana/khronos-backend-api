require("dotenv").config();
const express = require("express");
const cors = require("cors");
const database = require("./config/Database");
const userRouter = require("./routes/UserRoute");
const sheetProductDataRouter = require("./routes/sheetProductDataRoutes");
const sheetServiceDataRouter = require("./routes/sheetServiceDataRoutes");
const saleRoutes = require("./routes/saleRoute");
require("./models/associations");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/sheet/product", sheetProductDataRouter);
app.use("/api/v1/sheet/service", sheetServiceDataRouter);
app.use("/api/v1/sales", saleRoutes);

app.get("/", (_, res) => {
  res.send({ message: `Hello world!` });
});

const startServer = async () => {
  try {
    await database.authenticate();

    console.log("Database connected and synced successfully ✅");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;