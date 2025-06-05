const AppError = require("../errors/AppError")
const ProductService = require("../services/ProductService")

class ProductController {
    async create(name, code, price, description, zoning, product_type, observation, segment, image, image_public_id) {
        if (!name || !price || !product_type) {
            throw new AppError("Name, price, and product_type are required.", 400)
        }
        return ProductService.create(
            name,
            code,
            price,
            description,
            zoning,
            product_type,
            observation,
            segment,
            image,
            image_public_id,
        )
    }

    async findProduct(id) {
        if (!id) throw new AppError("Id is required", 400)
        return ProductService.findProduct(id)
    }

    async findByCode(code) {
        if (!code) throw new AppError("Code is required", 400)
        return ProductService.findByCode(code)
    }

    async findByType(product_type) {
        if (!product_type) throw new AppError("Product type is required", 400)
        return ProductService.findByType(product_type)
    }

    async findBySegment(segment) {
        if (!segment) throw new AppError("Segment is required", 400)
        return ProductService.findBySegment(segment)
    }

    async findByPriceRange(minPrice, maxPrice) {
        if (minPrice === undefined || maxPrice === undefined) {
            throw new AppError("Min price and max price are required", 400)
        }
        if (minPrice < 0 || maxPrice < 0) {
            throw new AppError("Prices must be positive numbers", 400)
        }
        if (minPrice > maxPrice) {
            throw new AppError("Min price cannot be greater than max price", 400)
        }
        return ProductService.findByPriceRange(minPrice, maxPrice)
    }

    async update(id, name, code, price, description, zoning, product_type, observation, segment, image, image_public_id) {
        if (!id) {
            throw new AppError("Id is required", 400)
        }
        return ProductService.update(
            id,
            name,
            code,
            price,
            description,
            zoning,
            product_type,
            observation,
            segment,
            image,
            image_public_id,
        )
    }

    async delete(id) {
        if (!id) throw new AppError("Id is required", 400)
        return ProductService.delete(id)
    }

    async find() {
        return ProductService.find()
    }

    async bulkCreate(products) {
        if (!products || !Array.isArray(products)) {
            throw new AppError("Products array is required", 400)
        }

        // Validar cada produto
        for (let i = 0; i < products.length; i++) {
            const product = products[i]
            if (!product.name || !product.price || !product.product_type) {
                throw new AppError(`Product at index ${i}: Name, price, and product_type are required.`, 400)
            }
        }

        return ProductService.bulkCreate(products)
    }

    async deleteAll() {
        return ProductService.deleteAll()
    }
}

module.exports = new ProductController()
