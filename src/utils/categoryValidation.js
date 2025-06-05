const AppError = require("../errors/AppError")

class CategoryValidation {
    static validateCategoryData(categoryData) {
        const { name } = categoryData

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            throw new AppError("Category name is required and must be a valid string.", 400)
        }

        return true
    }

    static validateUpdateData(updateData) {
        const { name } = updateData

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            throw new AppError("Category name is required and must be a valid string.", 400)
        }

        return true
    }
}

module.exports = CategoryValidation
