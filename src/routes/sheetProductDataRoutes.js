const express = require("express");
const router = express.Router();
const controller = require("../controllers/sheetProductDataController");
const authMiddleware = require("../middlewares/auth");

router.get("/getData", authMiddleware(["admin"]), controller.getData);
router.get("/getRows", authMiddleware(["admin"]), controller.getRows);
router.post("/addRow", authMiddleware(["admin"]), controller.addRow);
router.post("/updateValue", authMiddleware(["admin"]), controller.updateValue);
router.post("/import-products", authMiddleware(["admin"]), controller.importProductController);

module.exports = router;
