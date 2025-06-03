const AppError = require("../errors/AppError");
const CustomerService = require("../services/CustomerService");

class CustomerController {
    async create(name, email, contact, observation, adress, cep) {
        if (!name || !contact) {
            throw new AppError("Name and contact are required", 400);
        }

        return CustomerService.create(name, email, contact, observation, adress, cep);
    }

    async findById(id) {
        if (!id) throw new AppError("Id is required", 400);
        return CustomerService.findById(id);
    }

    async findAll() {
        return CustomerService.findAll();
    }

    async update(id, name, email, contact, observation, adress, cep) {
        if (!id || !name || !contact) {
            throw new AppError("Id, name, and contact are required", 400);
        }

        return CustomerService.update(id, name, email, contact, observation, adress, cep);
    }

    async delete(id) {
        if (!id) throw new AppError("Id is required", 400);
        return CustomerService.delete(id);
    }
}

module.exports = new CustomerController();
