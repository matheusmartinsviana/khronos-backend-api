const EnvironmentController = require("../controllers/EnvironmentController");

class EnvironmentApi {
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

    _validateEnvironmentData(data) {
        const { name, description } = data;

        const validatedName = this._validateName(name);

        return {
            name: validatedName,
            description: description?.trim() || null
        };
    }

    _handleError(res, error, defaultMessage = "Internal server error") {
        console.error(`EnvironmentApi Error: ${error.message}`, error);

        const statusCode = error.statusCode || 400;
        const message = error.message || defaultMessage;

        return res.status(statusCode).json({
            error: message,
            timestamp: new Date().toISOString()
        });
    }

    async createEnvironment(req, res) {
        try {
            const validatedData = this._validateEnvironmentData(req.body);

            const environment = await EnvironmentController.create(
                validatedData.name,
                validatedData.description
            );

            return res.status(201).json({
                success: true,
                data: environment,
                message: "Environment created successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error creating environment");
        }
    }

    async updateEnvironment(req, res) {
        try {
            const id = this._validateId(req.params.id);
            const validatedData = this._validateEnvironmentData(req.body);

            const environment = await EnvironmentController.update(
                id,
                validatedData.name,
                validatedData.description
            );

            if (!environment) {
                return res.status(404).json({
                    success: false,
                    error: "Environment not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: environment,
                message: "Environment updated successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error updating environment");
        }
    }

    async deleteEnvironment(req, res) {
        try {
            const id = this._validateId(req.params.id);

            const deleted = await EnvironmentController.delete(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    error: "Environment not found"
                });
            }

            return res.status(204).send();
        } catch (error) {
            return this._handleError(res, error, "Error deleting environment");
        }
    }

    async findEnvironments(req, res) {
        try {
            const { page = 1, limit = 10, search } = req.query;
            const options = {
                page: Number(page),
                limit: Number(limit),
                search: search?.trim()
            };

            const environments = await EnvironmentController.find(options);

            return res.status(200).json({
                success: true,
                data: environments,
                message: "Environments retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error listing environments");
        }
    }

    async findEnvironmentById(req, res) {
        try {
            const id = this._validateId(req.params.id);

            const environment = await EnvironmentController.findEnvironment(id);

            if (!environment) {
                return res.status(404).json({
                    success: false,
                    error: "Environment not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: environment,
                message: "Environment retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error retrieving environment");
        }
    }

    async findEnvironmentByName(req, res) {
        try {
            const name = this._validateName(req.params.name);

            const environment = await EnvironmentController.findByName(name);

            if (!environment) {
                return res.status(404).json({
                    success: false,
                    error: "Environment not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: environment,
                message: "Environment retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error retrieving environment by name");
        }
    }

    async bulkCreateEnvironments(req, res) {
        try {
            const { environments } = req.body;

            if (!environments || !Array.isArray(environments) || environments.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: "Valid environments array is required"
                });
            }

            const validatedEnvironments = environments.map(env => {
                if (typeof env === 'string') {
                    return { name: this._validateName(env), description: null };
                } else if (env?.name) {
                    return this._validateEnvironmentData(env);
                } else {
                    throw new Error("Each environment must have a valid name");
                }
            });

            const createdEnvironments = await EnvironmentController.bulkCreate(validatedEnvironments);

            return res.status(201).json({
                success: true,
                data: createdEnvironments,
                message: `${createdEnvironments.length} environments created successfully`
            });
        } catch (error) {
            return this._handleError(res, error, "Error creating environments in bulk");
        }
    }

    async getProductsByEnvironment(req, res) {
        try {
            const id = this._validateId(req.params.id);
            const { page = 1, limit = 10 } = req.query;

            const options = {
                page: Number(page),
                limit: Number(limit)
            };

            const products = await EnvironmentController.getProductsByEnvironment(id, options);

            return res.status(200).json({
                success: true,
                data: products,
                message: "Products retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error retrieving products by environment");
        }
    }

    async getEnvironmentStats(req, res) {
        try {
            const id = this._validateId(req.params.id);

            const stats = await EnvironmentController.getEnvironmentStats(id);

            return res.status(200).json({
                success: true,
                data: stats,
                message: "Environment statistics retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error retrieving environment statistics");
        }
    }
}

module.exports = new EnvironmentApi();
