const AppError = require("../errors/AppError");
const EnvironmentService = require("../services/EnvironmentService");

class EnvironmentController {
    async create(name, description) {
        if (!name || !description) {
            throw new AppError("Name and description are required.", 400);
        }
        return EnvironmentService.create(name, description);
    }

    async findEnvironment(id) {
        if (!id) throw new AppError("Id is required", 400);
        return EnvironmentService.findEnvironment(id);
    }

    async findByName(name) {
        if (!name) throw new AppError("Name is required", 400);
        return EnvironmentService.findByName(name);
    }

    async findEnvironmentById(id) {
        if (!id) throw new AppError("Id is required", 400);
        return EnvironmentService.findEnvironment(id);
    }

    async findEnvironmentByName(name) {
        if (!name) throw new AppError("Name is required", 400);
        return EnvironmentService.findByName(name);
    }

    async update(id, name, description) {
        if (!id || !name || !description) {
            throw new AppError("Id, name, and description are required", 400);
        }
        return EnvironmentService.update(id, name, description);
    }

    async delete(id) {
        if (!id) throw new AppError("Id is required", 400);
        return EnvironmentService.delete(id);
    }

    async find() {
        console.log("Finding all environments");

        const environments = await EnvironmentService.find();

        if (!environments || environments.length === 0) {
            throw new AppError("No environments found", 404);
        }

        return environments;
    }

    async bulkCreate(environments) {
        if (!environments || !Array.isArray(environments) || environments.length === 0) {
            throw new AppError("Environments array is required", 400);
        }
        return EnvironmentService.bulkCreate(environments);
    }
}

module.exports = new EnvironmentController();