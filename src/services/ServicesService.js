const AppError = require("../errors/AppError");
const ServiceRepository = require("../repositories/ServiceRepository");

class ServiceService {
    async create(data) {
        const { name, price, product_type } = data;
        if (!name || !price || !product_type) {
            throw new AppError("Name, price and product_type are required", 400);
        }
        return await ServiceRepository.create(data);
    }

    async findById(id) {
        if (!id) throw new AppError("Id is required", 400);
        const service = await ServiceRepository.findById(id);
        if (!service) throw new AppError("Service not found", 404);
        return service;
    }

    async findAll() {
        return await ServiceRepository.findAll();
    }

    async update(id, data) {
        if (!id || !data.name || !data.price || !data.product_type) {
            throw new AppError("Id, name, price and product_type are required", 400);
        }

        const updated = await ServiceRepository.update(id, data);
        if (updated[0] === 0) throw new AppError("Service not found or not updated", 404);

        return await this.findById(id);
    }

    async delete(id) {
        if (!id) throw new AppError("Id is required", 400);
        const deleted = await ServiceRepository.delete(id);
        if (!deleted) throw new AppError("Service not found or not deleted", 404);
    }
}

module.exports = new ServiceService();
