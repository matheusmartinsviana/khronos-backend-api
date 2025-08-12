require("dotenv").config();
const express = require("express");
const cors = require("cors");
const database = require("./config/Database");
const userRouter = require("./routes/UserRoute");
const sheetProductDataRouter = require("./routes/sheetProductDataRoutes");
const sheetServiceDataRouter = require("./routes/sheetServiceDataRoutes");
const saleRoutes = require("./routes/SaleRoute");
const customerRouter = require("./routes/CustomerRoute");
const serviceRouter = require("./routes/ServicesRoute");
const productRouter = require("./routes/ProductRoutes");
const categoryRouter = require("./routes/CategoryRoutes");
const authRoutes = require("./routes/AuthRoutes");
const emailRoutes = require("./routes/emailRoutes");
const environmentRouter = require("./routes/EnvironmentRoutes");
const { ensureDefaultEnvironment, ensureDefaultCategory } = require("./utils/InitialData");

require("./models/associations");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/sheet/product", sheetProductDataRouter);
app.use("/api/v1/sheet/service", sheetServiceDataRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/sales", saleRoutes);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/service", serviceRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use('/api/v1/email', emailRoutes);
app.use("/api/v1/environment", environmentRouter);

app.get("/", (_, res) => {
  res.send({ message: `Hello world!` });
});

const startServer = async () => {
  try {
    await database.authenticate();
    console.log("Database connected and synced successfully ✅");

    await ensureDefaultCategory();
    await ensureDefaultEnvironment();

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