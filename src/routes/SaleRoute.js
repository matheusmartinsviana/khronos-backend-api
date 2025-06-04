const express = require("express");
const router = express.Router();
const controller = require("../controllers/sheetProductDataController");
const authMiddleware = require("../middlewares/auth");

router.get("/getData", authMiddleware(), controller.getData);
router.get("/getRows", authMiddleware(), controller.getRows);
router.post("/addRow", authMiddleware(), controller.addRow);
router.post("/updateValue", authMiddleware(), controller.updateValue);
router.post("/import-products", authMiddleware(), controller.importProductController);

module.exports = router;
