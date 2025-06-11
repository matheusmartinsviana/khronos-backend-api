const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const controller = require("../controllers/sheetServiceDataController");

router.get("/getData", authMiddleware(["admin"]), controller.getData);
router.get("/getRows", authMiddleware(["admin"]), controller.getRows);
router.post("/addRow", authMiddleware(["admin"]), controller.addRow);
router.post("/updateValue", authMiddleware(["admin"]), controller.updateValue);
router.post("/import-services", authMiddleware(["admin"]), controller.importServiceController);

module.exports = router;
