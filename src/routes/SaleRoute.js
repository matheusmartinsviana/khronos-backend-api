const express = require("express");
const router = express.Router();
const SaleController = require("../controllers/SaleController");

router.post("/", SaleController.create);
router.get("/", SaleController.getAll);
router.get("/:id", SaleController.getById);
router.put("/:id", SaleController.update);
router.delete("/:id", SaleController.delete);

module.exports = router;
