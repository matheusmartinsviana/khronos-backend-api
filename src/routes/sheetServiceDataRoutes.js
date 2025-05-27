const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const controller = require("../controllers/sheetServiceDataController");

router.get("/getData", authMiddleware(), controller.getData);
router.get("/getRows", authMiddleware(), controller.getRows);
router.post("/addRow", authMiddleware(), controller.addRow);
router.post("/updateValue", authMiddleware(), controller.updateValue);
router.post("/import-services", authMiddleware(), controller.importServiceController);

module.exports = router;
