const { Op } = require("sequelize")
const ProductModel = require("../models/ProductModel")

class CategoryRepository {
    constructor(CategoryModel) {
        this.CategoryModel = CategoryModel
    }

    async create(categoryData) {
        return await this.CategoryModel.create(categoryData)
    }

    async bulkCreate(categoriesData) {
        return await this.CategoryModel.bulkCreate(categoriesData, {
            validate: true,
        })
    }

    async findById(id) {
        return await this.CategoryModel.findByPk(id)
    }

    async findByName(name) {
        return await this.CategoryModel.findOne({
            where: {
                name: {
                    [Op.iLike]: name,
                },
            },
        })
    }

    async findAll() {
        return await this.CategoryModel.findAll({
            order: [["name", "ASC"]],
        })
    }

    async update(id, updateData) {
        const category = await this.CategoryModel.findByPk(id)
        if (!category) {
            throw new Error("Category not found")
        }

        Object.keys(updateData).forEach((key) => {
            category[key] = updateData[key]
        })

        await category.save()
        return category
    }

    async delete(id) {
        const category = await this.CategoryModel.findByPk(id)
        if (!category) {
            throw new Error("Category not found")
        }
        return await category.destroy()
    }

    // Métodos adicionais úteis
    async findByNameLike(namePattern) {
        return await this.CategoryModel.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${namePattern}%`,
                },
            },
            order: [["name", "ASC"]],
        })
    }

    async count() {
        return await this.CategoryModel.count()
    }

    async findWithPagination(page = 1, limit = 10) {
        const offset = (page - 1) * limit
        return await this.CategoryModel.findAndCountAll({
            limit,
            offset,
            order: [["name", "ASC"]],
        })
    }

    async getProductsByCategory(categoryId) {
        return await this.CategoryModel.findByPk(categoryId, {
            include: [
                {
                    model: ProductModel,
                    as: "products",
                },
            ],
        })
    }

    async countProductsByCategory(categoryId) {
        const category = await this.CategoryModel.findByPk(categoryId, {
            include: [
                {
                    model: ProductModel,
                    as: "products",
                },
            ],
        })

        return category?.products?.length || 0
    }
}

module.exports = CategoryRepository
