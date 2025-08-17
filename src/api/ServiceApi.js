const ServiceController = require("../controllers/ServiceController");

class ServiceApi {
    _validateId(id) {
        if (!id || isNaN(Number(id))) {
            throw new Error("Valid ID is required");
        }
        return Number(id);
    }

    _validateServiceData(data) {
        const { name, description, price, duration, environment_id } = data;

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new Error("Valid name is required");
        }

        if (price && (isNaN(Number(price)) || Number(price) < 0)) {
            throw new Error("Valid price is required");
        }

        if (duration && (isNaN(Number(duration)) || Number(duration) < 0)) {
            throw new Error("Valid duration is required");
        }

        if (environment_id && isNaN(Number(environment_id))) {
            throw new Error("Valid environment ID is required");
        }

        return {
            name: name.trim(),
            description: description?.trim() || null,
            price: price ? Number(price) : null,
            duration: duration ? Number(duration) : null,
            environment_id: environment_id ? Number(environment_id) : null,
            ...data
        };
    }

    _handleError(res, error, defaultMessage = "Internal server error") {
        console.error(`ServiceApi Error: ${error.message}`, error);

        const statusCode = error.statusCode || 400;
        const message = error.message || defaultMessage;

        return res.status(statusCode).json({
            error: message,
            timestamp: new Date().toISOString()
        });
    }

    async createService(req, res) {
        try {
            const validatedData = this._validateServiceData(req.body);

            const service = await ServiceController.create(validatedData);

            return res.status(201).json({
                success: true,
                data: service,
                message: "Service created successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error creating service");
        }
    }

    async getServiceById(req, res) {
        try {
            const id = this._validateId(req.params.id);

            const service = await ServiceController.findById(id);

            if (!service) {
                return res.status(404).json({
                    success: false,
                    error: "Service not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: service,
                message: "Service retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error retrieving service");
        }
    }

    async findServiceByEnvironment(req, res) {
        try {
            const id = this._validateId(req.params.id);
            const { page = 1, limit = 10 } = req.query;

            const options = {
                page: Number(page),
                limit: Number(limit)
            };

            const services = await ServiceController.findByEnvironment(id, options);

            return res.status(200).json({
                success: true,
                data: services,
                message: "Services retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error retrieving services by environment");
        }
    }

    async getAllServices(req, res) {
        try {
            const { page = 1, limit = 10, search, environment, priceMin, priceMax } = req.query;

            const options = {
                page: Number(page),
                limit: Number(limit),
                search: search?.trim(),
                environment: environment?.trim(),
                priceMin: priceMin ? Number(priceMin) : undefined,
                priceMax: priceMax ? Number(priceMax) : undefined
            };

            const services = await ServiceController.findAll(options);

            return res.status(200).json({
                success: true,
                data: services,
                message: "Services retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error listing services");
        }
    }

    async updateService(req, res) {
        try {
            const id = this._validateId(req.params.id);
            const validatedData = this._validateServiceData(req.body);

            const updatedService = await ServiceController.update(id, validatedData);

            if (!updatedService) {
                return res.status(404).json({
                    success: false,
                    error: "Service not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: updatedService,
                message: "Service updated successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error updating service");
        }
    }

    async deleteService(req, res) {
        try {
            const id = this._validateId(req.params.id);

            const deleted = await ServiceController.delete(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    error: "Service not found"
                });
            }

            return res.status(204).send();
        } catch (error) {
            return this._handleError(res, error, "Error deleting service");
        }
    }

    async bulkCreateServices(req, res) {
        try {
            const { services } = req.body;

            if (!services || !Array.isArray(services) || services.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: "Valid services array is required"
                });
            }

            const validatedServices = services.map(service =>
                this._validateServiceData(service)
            );

            const createdServices = await ServiceController.bulkCreate(validatedServices);

            return res.status(201).json({
                success: true,
                data: createdServices,
                message: `${createdServices.length} services created successfully`
            });
        } catch (error) {
            return this._handleError(res, error, "Error creating services in bulk");
        }
    }

    async getServiceStats(req, res) {
        try {
            const id = this._validateId(req.params.id);

            const stats = await ServiceController.getServiceStats(id);

            return res.status(200).json({
                success: true,
                data: stats,
                message: "Service statistics retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error retrieving service statistics");
        }
    }

    async searchServices(req, res) {
        try {
            const { query, category, priceRange, sortBy = 'name', order = 'asc' } = req.query;

            if (!query || query.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    error: "Search query is required"
                });
            }

            const searchOptions = {
                query: query.trim(),
                category: category?.trim(),
                priceRange: priceRange?.trim(),
                sortBy,
                order
            };

            const services = await ServiceController.search(searchOptions);

            return res.status(200).json({
                success: true,
                data: services,
                message: "Services search completed successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error searching services");
        }
    }
}

module.exports = new ServiceApi();
