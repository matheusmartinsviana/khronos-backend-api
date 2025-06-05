const express = require("express")
const ProductApi = require("../api/ProductApi")
const authMiddleware = require("../middlewares/auth");

const router = express.Router()

router.get("/", authMiddleware(), ProductApi.findProducts)
router.get("/:id", authMiddleware(), ProductApi.findProductById)
router.get("/type/:type", authMiddleware(), ProductApi.findProductsByType)
router.get("/segment/:segment", authMiddleware(), ProductApi.findProductsBySegment)
router.get("/price-range", authMiddleware(), ProductApi.findProductsByPriceRange)

router.post("/", authMiddleware(), ProductApi.createProduct)
router.put("/:id", authMiddleware(), ProductApi.updateProduct)
router.delete("/:id", authMiddleware(), ProductApi.deleteProduct)

router.post("/bulk", authMiddleware(), ProductApi.bulkCreateProducts)
router.delete("/", authMiddleware(), ProductApi.deleteAllProducts)

module.exports = router
