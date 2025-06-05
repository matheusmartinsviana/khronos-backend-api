const CategoryController = require("../controllers/CategoryController")

class CategoryApi {
    async createCategory(req, res) {
        const { name } = req.body

        try {
            const category = await CategoryController.create(name)
            return res.status(201).send(category)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async updateCategory(req, res) {
        const { id } = req.params
        const { name } = req.body

        try {
            const category = await CategoryController.update(id, name)
            return res.status(200).send(category)
        } catch (e) {
            return res.status(400).send({ error: `Error updating category: ${e.message}` })
        }
    }

    async deleteCategory(req, res) {
        try {
            const { id } = req.params

            await CategoryController.delete(Number(id))
            return res.status(204).send()
        } catch (e) {
            return res.status(400).send({ error: `Error deleting category: ${e.message}` })
        }
    }

    async findCategories(req, res) {
        try {
            const categories = await CategoryController.find()
            return res.status(200).send(categories)
        } catch (e) {
            return res.status(400).send({ error: `Error listing categories: ${e.message}` })
        }
    }

    async findCategoryById(req, res) {
        const { id } = req.params

        try {
            if (!id) {
                return res.status(400).send({ error: "Id is required" })
            }
            const category = await CategoryController.findCategory(id)
            return res.status(200).send(category)
        } catch (e) {
            return res.status(400).send({ error: `Error to get category: ${e.message}` })
        }
    }

    async findCategoryByName(req, res) {
        const { name } = req.params

        try {
            if (!name) {
                return res.status(400).send({ error: "Name is required" })
            }
            const category = await CategoryController.findByName(name)
            return res.status(200).send(category)
        } catch (e) {
            return res.status(400).send({ error: `Error to get category by name: ${e.message}` })
        }
    }

    async bulkCreateCategories(req, res) {
        const { categories } = req.body

        try {
            if (!categories || !Array.isArray(categories)) {
                return res.status(400).send({ error: "Categories array is required" })
            }
            const createdCategories = await CategoryController.bulkCreate(categories)
            return res.status(201).send(createdCategories)
        } catch (e) {
            return res.status(400).send({ error: `Error creating categories in bulk: ${e.message}` })
        }
    }

    async getProductsByCategory(req, res) {
        const { id } = req.params

        try {
            if (!id) {
                return res.status(400).send({ error: "Category id is required" })
            }
            const products = await CategoryController.getProductsByCategory(id)
            return res.status(200).send(products)
        } catch (e) {
            return res.status(400).send({ error: `Error getting products by category: ${e.message}` })
        }
    }
}

module.exports = new CategoryApi()
