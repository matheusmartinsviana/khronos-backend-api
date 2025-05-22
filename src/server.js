require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8000;
const database = require("./config/Database");
const userRouter = require("./routes/UserRoute");
const sheetProductDataRouter = require("./routes/sheetDataRoutes");

app.use(express.json());
app.use(cors());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/sheet/product", sheetProductDataRouter);

app.get("/", (_, res) => {
  res.send({ message: `Hello world!` });
});

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`); 
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
