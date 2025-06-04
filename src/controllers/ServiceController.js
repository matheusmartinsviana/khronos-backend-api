const ServiceService = require("../services/ServicesService");
const AppError = require("../errors/AppError");

class ServiceController {
    async create(data) {
        return await ServiceService.create(data);
    }

    async findById(id) {
        return await ServiceService.findById(id);
    }

    async findAll() {
        return await ServiceService.findAll();
    }

    async update(id, data) {
        return await ServiceService.update(id, data);
    }

    async delete(id) {
        return await ServiceService.delete(id);
    }
}

module.exports = new ServiceController();
