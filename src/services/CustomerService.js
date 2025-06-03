const Customer = require("../models/CustomerModel");
const AppError = require("../errors/AppError");

class CustomerService {
    async create(name, email, contact, observation, adress, cep) {
        try {
            return await Customer.create({ name, email, contact, observation, adress, cep });
        } catch (error) {
            if (error.errors?.[0]?.validatorKey === "isEmail") {
                throw new AppError("Invalid email format.", 400);
            }
            throw new AppError("Error creating customer.");
        }
    }

    async findById(id) {
        const customer = await Customer.findByPk(id);
        if (!customer) throw new AppError("Customer not found", 404);
        return customer;
    }

    async findAll() {
        return await Customer.findAll();
    }

    async update(id, name, email, contact, observation, adress, cep) {
        const customer = await this.findById(id);

        customer.name = name;
        customer.email = email;
        customer.contact = contact;
        customer.observation = observation;
        customer.adress = adress;
        customer.cep = cep;

        await customer.save();
        return customer;
    }

    async delete(id) {
        const customer = await this.findById(id);
        await customer.destroy();
    }
}

module.exports = new CustomerService();
