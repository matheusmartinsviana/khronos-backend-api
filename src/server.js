require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const database = require("./config/Database");
const userRouter = require("./routes/UserRoute");

app.use(express.json());
app.use(cors());
app.use("/api/v1/user", userRouter);

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
