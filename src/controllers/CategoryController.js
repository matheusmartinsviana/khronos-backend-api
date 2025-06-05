const AppError = require("../errors/AppError")
const CategoryService = require("../services/CategoryService")

class CategoryController {
    async create(name) {
        if (!name) {
            throw new AppError("Category name is required.", 400)
        }
        return CategoryService.create(name)
    }

    async findCategory(id) {
        if (!id) throw new AppError("Id is required", 400)
        return CategoryService.findCategory(id)
    }

    async findByName(name) {
        if (!name) throw new AppError("Name is required", 400)
        return CategoryService.findByName(name)
    }

    async update(id, name) {
        if (!id || !name) {
            throw new AppError("Id and name are required", 400)
        }
        return CategoryService.update(id, name)
    }

    async delete(id) {
        if (!id) throw new AppError("Id is required", 400)
        return CategoryService.delete(id)
    }

    async find() {
        return CategoryService.find()
    }

    async bulkCreate(categories) {
        if (!categories || !Array.isArray(categories)) {
            throw new AppError("Categories array is required", 400)
        }

        // Validar cada categoria
        for (let i = 0; i < categories.length; i++) {
            const category = categories[i]
            if (!category.name) {
                throw new AppError(`Category at index ${i}: Name is required.`, 400)
            }
        }

        return CategoryService.bulkCreate(categories)
    }

    async getProductsByCategory(categoryId) {
        if (!categoryId) throw new AppError("Category id is required", 400)
        return CategoryService.getProductsByCategory(categoryId)
    }
}

module.exports = new CategoryController()
