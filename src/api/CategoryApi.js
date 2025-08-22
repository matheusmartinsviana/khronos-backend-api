const CategoryController = require("../controllers/CategoryController");

class CategoryApi {
    _validateId(id) {
        if (!id || isNaN(Number(id))) {
            throw new Error("Valid ID is required");
        }
        return Number(id);
    }

    _validateName(name) {
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new Error("Valid name is required");
        }
        return name.trim();
    }

    _handleError(res, error, defaultMessage = "Internal server error") {
        console.error(`CategoryApi Error: ${error.message}`, error);

        const statusCode = error.statusCode || 400;
        const message = error.message || defaultMessage;

        return res.status(statusCode).json({
            error: message,
            timestamp: new Date().toISOString()
        });
    }

    async createCategory(req, res) {
        try {
            const name = this._validateName(req.body.name);

            const category = await CategoryController.create(name);
            return res.status(201).json({
                success: true,
                data: category,
                message: "Category created successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error creating category");
        }
    }

    async updateCategory(req, res) {
        try {
            const id = this._validateId(req.params.id);
            const name = this._validateName(req.body.name);

            const category = await CategoryController.update(id, name);
            return res.status(200).json({
                success: true,
                data: category,
                message: "Category updated successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error updating category");
        }
    }

    async deleteCategory(req, res) {
        try {
            const id = this._validateId(req.params.id);

            await CategoryController.delete(id);
            return res.status(204).send();
        } catch (error) {
            return this._handleError(res, error, "Error deleting category");
        }
    }

    async findCategories(req, res) {
        try {
            const { page = 1, limit = 10, search } = req.query;
            const options = {
                page: Number(page),
                limit: Number(limit),
                search: search?.trim()
            };

            const categories = await CategoryController.find(options);
            return res.status(200).json({
                success: true,
                data: categories,
                message: "Categories retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error listing categories");
        }
    }

    async findCategoryById(req, res) {
        try {
            const id = this._validateId(req.params.id);

            const category = await CategoryController.findCategory(id);

            if (!category) {
                return res.status(404).json({
                    success: false,
                    error: "Category not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: category,
                message: "Category retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error retrieving category");
        }
    }

    async findCategoryByName(req, res) {
        try {
            const name = this._validateName(req.params.name);

            const category = await CategoryController.findByName(name);

            if (!category) {
                return res.status(404).json({
                    success: false,
                    error: "Category not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: category,
                message: "Category retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error retrieving category by name");
        }
    }

    async bulkCreateCategories(req, res) {
        try {
            const { categories } = req.body;

            if (!categories || !Array.isArray(categories) || categories.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: "Valid categories array is required"
                });
            }

            const validatedCategories = categories.map(cat => {
                if (typeof cat === 'string') {
                    return this._validateName(cat);
                } else if (cat?.name) {
                    return this._validateName(cat.name);
                } else {
                    throw new Error("Each category must have a valid name");
                }
            });

            const createdCategories = await CategoryController.bulkCreate(validatedCategories);
            return res.status(201).json({
                success: true,
                data: createdCategories,
                message: `${createdCategories.length} categories created successfully`
            });
        } catch (error) {
            return this._handleError(res, error, "Error creating categories in bulk");
        }
    }

    async getProductsByCategory(req, res) {
        try {
            const id = this._validateId(req.params.id);

            const { page = 1, limit = 10 } = req.query;
            const options = {
                page: Number(page),
                limit: Number(limit)
            };

            const products = await CategoryController.getProductsByCategory(id, options);
            return res.status(200).json({
                success: true,
                data: products,
                message: "Products retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error retrieving products by category");
        }
    }

    async getCategoryStats(req, res) {
        try {
            const id = this._validateId(req.params.id);

            const stats = await CategoryController.getCategoryStats(id);
            return res.status(200).json({
                success: true,
                data: stats,
                message: "Category statistics retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error retrieving category statistics");
        }
    }
}

module.exports = new CategoryApi();
