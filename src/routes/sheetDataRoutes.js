const express = require("express");
const router = express.Router();
const controller = require("../controllers/sheetDataController");
const authMiddleware = require("../middlewares/auth");
const importController = require("../controllers/importController");

router.get("/getData", authMiddleware(), controller.getData);
router.get("/getRows", authMiddleware(), controller.getRows);
router.post("/addRow", authMiddleware(), controller.addRow);
router.post("/updateValue", authMiddleware(), controller.updateValue);
router.post("/import-products", authMiddleware(), importController);

module.exports = router;
