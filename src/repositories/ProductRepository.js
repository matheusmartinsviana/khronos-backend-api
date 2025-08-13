const { Op } = require("sequelize")

class ProductRepository {
    constructor(ProductModel) {
        this.ProductModel = ProductModel
    }

    async create(productData) {
        return await this.ProductModel.create(productData)
    }

    async bulkCreate(productsData) {
        return await this.ProductModel.bulkCreate(productsData)
    }

    async findById(id) {
        return await this.ProductModel.findByPk(id)
    }

    async findByCode(code) {
        return await this.ProductModel.findOne({
            where: { code },
        })
    }

    async findByType(product_type) {
        return await this.ProductModel.findAll({
            where: { product_type },
        })
    }

    async findBySegment(segment) {
        return await this.ProductModel.findAll({
            where: { segment },
        })
    }

    async findByPriceRange(minPrice, maxPrice) {
        return await this.ProductModel.findAll({
            where: {
                price: {
                    [Op.between]: [minPrice, maxPrice],
                },
            },
        })
    }

    async findAll() {
        return await this.ProductModel.findAll()
    }

    async findByEnvironment(environmentId) {
        if (!environmentId) throw new Error("Environment ID is required")
        return await this.ProductModel.findAll({
            where: { environment_id: environmentId },
        })
    }

    async update(id, updateData) {
        const product = await this.ProductModel.findByPk(id)
        if (!product) {
            throw new Error("Product not found")
        }

        Object.keys(updateData).forEach((key) => {
            product[key] = updateData[key]
        })

        await product.save()
        return product
    }

    async delete(id) {
        const product = await this.ProductModel.findByPk(id)
        if (!product) {
            throw new Error("Product not found")
        }
        return await product.destroy()
    }

    async deleteAll() {
        return await this.ProductModel.destroy({ where: {} })
    }

    // Métodos adicionais úteis
    async findByName(name) {
        return await this.ProductModel.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`,
                },
            },
        })
    }

    async findByZoning(zoning) {
        return await this.ProductModel.findAll({
            where: { zoning },
        })
    }

    async count() {
        return await this.ProductModel.count()
    }

    async findWithPagination(page = 1, limit = 10) {
        const offset = (page - 1) * limit
        return await this.ProductModel.findAndCountAll({
            limit,
            offset,
            order: [["product_id", "DESC"]],
        })
    }

    async findByIdWithImages(id) {
        const ProductImageModel = require("../models/ProductImageModel")

        return await this.ProductModel.findByPk(id, {
            include: [
                {
                    model: ProductImageModel,
                    as: "images",
                    order: [["display_order", "ASC"]],
                },
            ],
        })
    }

    async findAllWithPrimaryImage() {
        const ProductImageModel = require("../models/ProductImageModel")

        return await this.ProductModel.findAll({
            include: [
                {
                    model: ProductImageModel,
                    as: "images",
                    where: { is_primary: true },
                    required: false, // LEFT JOIN para incluir produtos sem imagens
                },
            ],
        })
    }

    async searchTopProducts() {
        return await this.ProductModel.findAll({
            order: [["sales_count", "DESC"]],
            limit: 10,
        })
    }
}

module.exports = ProductRepository
