require("dotenv").config()
const CategoryRepository = require("../repositories/CategoryRepository")
const CategoryModel = require("../models/CategoryModel")
const AppError = require("../errors/AppError")

class CategoryService {
    constructor() {
        this.categoryRepository = new CategoryRepository(CategoryModel)
    }

    async create(name) {
        if (!name) {
            throw new AppError("Category name is required.", 400)
        }

        try {
            const existingCategory = await this.categoryRepository.findByName(name)
            if (existingCategory) {
                throw new AppError("A category with this name already exists.", 409)
            }

            const categoryData = { name }
            const createdCategory = await this.categoryRepository.create(categoryData)

            console.log("Category created successfully:", createdCategory)
            return {
                id: createdCategory.category_id,
                name: createdCategory.name,
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            if (error.name === "SequelizeUniqueConstraintError") {
                throw new AppError("A category with this name already exists.", 409)
            }
            console.error("Error creating category:", error)
            throw new AppError("An error occurred while creating the category. Please try again.")
        }
    }

    async findCategory(id) {
        if (!id) throw new AppError("Id is required", 400)

        const found = await this.categoryRepository.findById(id)
        if (!found) throw new AppError("Category not found", 404)

        return found
    }

    async findByName(name) {
        if (!name) throw new AppError("Name is required", 400)

        const found = await this.categoryRepository.findByName(name)
        if (!found) throw new AppError("Category not found", 404)

        return found
    }

    async update(id, name) {
        if (!id || !name) {
            throw new AppError("Id and name are required", 400)
        }

        const category = await this.findCategory(id)

        const existingCategory = await this.categoryRepository.findByName(name)
        if (existingCategory && existingCategory.category_id !== Number.parseInt(id)) {
            throw new AppError("A category with this name already exists.", 409)
        }

        const updateData = { name }
        const updatedCategory = await this.categoryRepository.update(id, updateData)
        return updatedCategory
    }

    async delete(id) {
        if (!id) throw new AppError("Id is required", 400)

        const productsCount = await this.categoryRepository.countProductsByCategory(id)
        if (productsCount > 0) {
            throw new AppError(`Cannot delete category: ${productsCount} products are associated with this category.`, 400)
        }

        const category = await this.findCategory(id)
        await this.categoryRepository.delete(id)
    }

    async find() {
        return await this.categoryRepository.findAll()
    }

    async bulkCreate(categories) {
        if (!categories || !Array.isArray(categories)) {
            throw new AppError("Categories array is required", 400)
        }

        for (let i = 0; i < categories.length; i++) {
            const category = categories[i]
            if (!category.name) {
                throw new AppError(`Category at index ${i}: Name is required.`, 400)
            }
        }

        try {
            const createdCategories = await this.categoryRepository.bulkCreate(categories)
            return createdCategories.map((category) => ({
                id: category.category_id,
                name: category.name,
            }))
        } catch (error) {
            if (error.name === "SequelizeUniqueConstraintError") {
                throw new AppError("One or more categories with duplicate names were found.", 409)
            }
            console.error("Error creating categories in bulk:", error)
            throw new AppError("An error occurred while creating categories in bulk. Please try again.")
        }
    }

    async getProductsByCategory(categoryId) {
        if (!categoryId) throw new AppError("Category id is required", 400)

        // Verificar se a categoria existe
        const category = await this.findCategory(categoryId)

        return await this.categoryRepository.getProductsByCategory(categoryId)
    }
}

module.exports = new CategoryService()
