const AppError = require("../errors/AppError")

class ProductValidation {
    static validateProductData(productData) {
        const { name, price, product_type } = productData

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            throw new AppError("Product name is required and must be a valid string.", 400)
        }

        if (!price || typeof price !== "number" || price <= 0) {
            throw new AppError("Product price is required and must be a positive number.", 400)
        }

        if (!product_type || typeof product_type !== "string" || product_type.trim().length === 0) {
            throw new AppError("Product type is required and must be a valid string.", 400)
        }

        return true
    }

    static validateUpdateData(updateData) {
        const allowedFields = [
            "name",
            "code",
            "price",
            "description",
            "zoning",
            "product_type",
            "observation",
            "segment",
            "image",
        ]
        const providedFields = Object.keys(updateData)

        // Verificar se pelo menos um campo foi fornecido
        if (providedFields.length === 0) {
            throw new AppError("At least one field must be provided for update.", 400)
        }

        // Verificar se todos os campos fornecidos são válidos
        const invalidFields = providedFields.filter((field) => !allowedFields.includes(field))
        if (invalidFields.length > 0) {
            throw new AppError(`Invalid fields: ${invalidFields.join(", ")}`, 400)
        }

        // Validar tipos específicos
        if (updateData.price !== undefined) {
            if (typeof updateData.price !== "number" || updateData.price <= 0) {
                throw new AppError("Price must be a positive number.", 400)
            }
        }

        if (updateData.name !== undefined) {
            if (typeof updateData.name !== "string" || updateData.name.trim().length === 0) {
                throw new AppError("Name must be a valid string.", 400)
            }
        }

        if (updateData.product_type !== undefined) {
            if (typeof updateData.product_type !== "string" || updateData.product_type.trim().length === 0) {
                throw new AppError("Product type must be a valid string.", 400)
            }
        }

        if (updateData.image !== undefined) {
            if (typeof updateData.image !== "string") {
                throw new AppError("Image must be a valid string (URL or path).", 400)
            }
        }

        return true
    }

    static validatePriceRange(minPrice, maxPrice) {
        if (typeof minPrice !== "number" || typeof maxPrice !== "number") {
            throw new AppError("Min price and max price must be numbers.", 400)
        }

        if (minPrice < 0 || maxPrice < 0) {
            throw new AppError("Prices must be positive numbers.", 400)
        }

        if (minPrice > maxPrice) {
            throw new AppError("Min price cannot be greater than max price.", 400)
        }

        return true
    }
}

module.exports = ProductValidation
