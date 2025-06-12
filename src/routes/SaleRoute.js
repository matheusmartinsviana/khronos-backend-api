const express = require("express");
const router = express.Router();
const SaleController = require("../controllers/SaleController");
const authMiddleware = require("../middlewares/auth");

router.post("/", authMiddleware(), SaleController.create);
router.get("/", authMiddleware(), SaleController.getAll);
router.get("/:id", authMiddleware(), SaleController.getById);
router.put("/:id", authMiddleware(), SaleController.update);
router.delete("/:id", authMiddleware(), SaleController.delete);
router.get("/getSales/:id", authMiddleware(), SaleController.getSalesById);


module.exports = router;
