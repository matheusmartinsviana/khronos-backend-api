const express = require("express")
const CategoryApi = require("../api/CategoryApi")
const authMiddleware = require("../middlewares/auth");

const router = express.Router()

router.get("/", authMiddleware(), CategoryApi.findCategories)
router.get("/:id", authMiddleware(), CategoryApi.findCategoryById)
router.get("/name/:name", authMiddleware(), CategoryApi.findCategoryByName)
router.get("/:id/products", authMiddleware(), CategoryApi.getProductsByCategory)

router.post("/", authMiddleware(), CategoryApi.createCategory)
router.put("/:id", authMiddleware(), CategoryApi.updateCategory)
router.delete("/:id", authMiddleware(), CategoryApi.deleteCategory)

router.post("/bulk", authMiddleware(), CategoryApi.bulkCreateCategories)

module.exports = router
