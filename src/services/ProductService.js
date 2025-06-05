require("dotenv").config()
const ProductRepository = require("../repositories/ProductRepository")
const ProductModel = require("../models/ProductModel")
const AppError = require("../errors/AppError")
const { Op } = require("sequelize")

class ProductService {
    constructor() {
        this.productRepository = new ProductRepository(ProductModel)
    }

    async create(name, code, price, description, zoning, product_type, observation, segment, image) {
        if (!name || !price || !product_type) {
            throw new AppError("Name, price, and product_type are required.", 400)
        }

        if (price <= 0) {
            throw new AppError("Price must be a positive number.", 400)
        }

        try {
            // Verificar se já existe um produto com o mesmo código (se fornecido)
            if (code) {
                const existingProduct = await this.productRepository.findByCode(code)
                if (existingProduct) {
                    throw new AppError("A product with this code already exists.", 409)
                }
            }

            const productData = {
                name,
                code,
                price,
                description,
                zoning,
                product_type,
                observation,
                segment,
                image,
            }

            const createdProduct = await this.productRepository.create(productData)

            console.log("Product created successfully:", createdProduct)
            return {
                id: createdProduct.product_id,
                name: createdProduct.name,
                code: createdProduct.code,
                price: createdProduct.price,
                description: createdProduct.description,
                zoning: createdProduct.zoning,
                product_type: createdProduct.product_type,
                observation: createdProduct.observation,
                segment: createdProduct.segment,
                image: createdProduct.image,
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            console.error("Error creating product:", error)
            throw new AppError("An error occurred while creating the product. Please try again.")
        }
    }

    async findProduct(id) {
        if (!id) throw new AppError("Id is required", 400)

        const found = await this.productRepository.findByIdWithImages(id)
        if (!found) throw new AppError("Product not found", 404)

        return found
    }

    async findByCode(code) {
        if (!code) throw new AppError("Code is required", 400)

        const found = await this.productRepository.findByCode(code)
        if (!found) throw new AppError("Product not found", 404)

        return found
    }

    async findByType(product_type) {
        if (!product_type) throw new AppError("Product type is required", 400)

        return await this.productRepository.findByType(product_type)
    }

    async findBySegment(segment) {
        if (!segment) throw new AppError("Segment is required", 400)

        return await this.productRepository.findBySegment(segment)
    }

    async findByPriceRange(minPrice, maxPrice) {
        if (minPrice === undefined || maxPrice === undefined) {
            throw new AppError("Min price and max price are required", 400)
        }

        return await this.productRepository.findByPriceRange(minPrice, maxPrice)
    }

    async update(id, name, code, price, description, zoning, product_type, observation, segment, image) {
        if (!id) {
            throw new AppError("Id is required", 400)
        }

        const product = await this.findProduct(id)

        // Verificar se o código já existe em outro produto (se fornecido)
        if (code && code !== product.code) {
            const existingProduct = await this.productRepository.findByCode(code)
            if (existingProduct && existingProduct.product_id !== Number.parseInt(id)) {
                throw new AppError("A product with this code already exists.", 409)
            }
        }

        if (price && price <= 0) {
            throw new AppError("Price must be a positive number.", 400)
        }

        const updateData = {}
        if (name !== undefined) updateData.name = name
        if (code !== undefined) updateData.code = code
        if (price !== undefined) updateData.price = price
        if (description !== undefined) updateData.description = description
        if (zoning !== undefined) updateData.zoning = zoning
        if (product_type !== undefined) updateData.product_type = product_type
        if (observation !== undefined) updateData.observation = observation
        if (segment !== undefined) updateData.segment = segment
        if (image !== undefined) updateData.image = image

        const updatedProduct = await this.productRepository.update(id, updateData)
        return updatedProduct
    }

    async delete(id) {
        if (!id) throw new AppError("Id is required", 400)

        const product = await this.findProduct(id)
        await this.productRepository.delete(id)
    }

    async find() {
        return await this.productRepository.findAll()
    }

    async bulkCreate(products) {
        if (!products || !Array.isArray(products)) {
            throw new AppError("Products array is required", 400)
        }

        // Validar todos os produtos antes de criar
        for (let i = 0; i < products.length; i++) {
            const product = products[i]
            if (!product.name || !product.price || !product.product_type) {
                throw new AppError(`Product at index ${i}: Name, price, and product_type are required.`, 400)
            }
            if (product.price <= 0) {
                throw new AppError(`Product at index ${i}: Price must be a positive number.`, 400)
            }
        }

        try {
            const createdProducts = await this.productRepository.bulkCreate(products)
            return createdProducts.map((product) => ({
                id: product.product_id,
                name: product.name,
                code: product.code,
                price: product.price,
                description: product.description,
                zoning: product.zoning,
                product_type: product.product_type,
                observation: product.observation,
                segment: product.segment,
                image: product.image,
            }))
        } catch (error) {
            console.error("Error creating products in bulk:", error)
            throw new AppError("An error occurred while creating products in bulk. Please try again.")
        }
    }

    async deleteAll() {
        return await this.productRepository.deleteAll()
    }

    async findWithPrimaryImage() {
        return await this.productRepository.findAllWithPrimaryImage()
    }
}

module.exports = new ProductService()
