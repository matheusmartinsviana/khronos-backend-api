const express = require("express")
const ProductApi = require("../api/ProductApi")
const authMiddleware = require("../middlewares/auth");

const router = express.Router()

router.get("/", ProductApi.findProducts)
router.get("/:id", ProductApi.findProductById)
router.get("/:id/image-variations", ProductApi.getImageVariations)
router.get("/search/top", ProductApi.searchTopProducts)

router.post("/", authMiddleware(), ProductApi.uploadSingle(), ProductApi.createProduct)
router.put("/:id", authMiddleware(), ProductApi.uploadSingle(), ProductApi.updateProduct)
router.delete("/:id", authMiddleware(), ProductApi.deleteProduct)

router.patch("/:id/image", authMiddleware(), ProductApi.uploadSingle(), ProductApi.updateProductImage)

router.post("/bulk", authMiddleware(), ProductApi.bulkCreateProducts)
router.delete("", authMiddleware(), ProductApi.deleteAllProducts)

module.exports = router
