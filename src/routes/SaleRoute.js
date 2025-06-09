const express = require("express");
const router = express.Router();
const SaleController = require("../controllers/SaleController");
const authMiddleware = require("../middlewares/auth");

router.post("/", SaleController.create);
router.get("/", SaleController.getAll);
router.get("/:id", SaleController.getById);
router.put("/:id", SaleController.update);
router.delete("/:id", SaleController.delete);
router.get("/getSales/:id", authMiddleware(), SaleController.getSalesById);


module.exports = router;
