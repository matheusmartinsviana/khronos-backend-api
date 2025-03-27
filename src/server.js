require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
const database = require("./config/Database");
const userRouter = require("./routes/UserRoute");

app.use(express.json());
app.use(cors());
app.use("/api/v1/user", userRouter);

app.get("/", (_, res) => {
  res.send({ message: `Hello world!` })
});

database.db
  .sync({ force: false })
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  })
  .catch((e) => {
    console.error(`Error: ${e}`);
  });