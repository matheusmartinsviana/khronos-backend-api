require("dotenv").config();
const environment = require("../models/EnvironmentModel");
const AppError = require("../errors/AppError");

class EnvironmentService {
    async create(name, description) {

        try {
            console.log("Creating environment:", name);
            const createdEnvironment = await environment.create({ name, description });

            console.log("Environment created successfully:", createdEnvironment);
            return createdEnvironment;
        } catch (error) {
            console.error("Error creating environment:", error);
            throw new AppError("An error occurred while creating the environment. Please try again.");
        }
    }

    async findEnvironment(id) {
        if (!id) throw new AppError("Id is required", 400);
        return environment.findByPk(id);
    }

    async findByName(name) {
        if (!name) throw new AppError("Name is required", 400);
        return environment.findOne({ where: { name } });
    }

    async update(id, name, description) {
        if (!id || !name || !description) {
            throw new AppError("Id, name, and description are required", 400);
        }
        const env = await this.findEnvironment(id);
        env.name = name;
        env.description = description;
        await env.save();
        return env;
    }

    async delete(id) {
        if (!id) throw new AppError("Id is required", 400);
        const env = await this.findEnvironment(id);
        await env.destroy();
    }

    async find() {
        return environment.findAll();
    }

    async bulkCreate(environments) {
        if (!environments || !Array.isArray(environments) || environments.length === 0) {
            throw new AppError("Environments array is required", 400);
        }
        return environment.bulkCreate(environments);
    }
}

module.exports = new EnvironmentService();