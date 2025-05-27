const express = require("express");
const router = express.Router();
const controller = require("../controllers/ProductController");
const authMiddleware = require("../middlewares/auth");

router.get("/get", authMiddleware(), controller.getProduct);
router.get("/get/:id", authMiddleware(), controller.getProductById);
router.post("/add", authMiddleware(), controller.addProduct);
router.put("/update", authMiddleware(), controller.updateProduct);
router.delete("/delete", authMiddleware(), controller.deleteProduct);

module.exports = router;
