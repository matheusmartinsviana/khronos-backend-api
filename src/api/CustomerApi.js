const CustomerController = require("../controllers/CustomerController");

class CustomerApi {
    async createCustomer(req, res) {
        const { name, email, contact, observation, adress, cep } = req.body;

        try {
            const customer = await CustomerController.create(name, email, contact, observation, adress, cep);
            return res.status(201).send(customer);
        } catch (e) {
            return res.status(400).send({ error: `Error creating customer: ${e.message}` });
        }
    }

    async getCustomerById(req, res) {
        try {
            const { id } = req.params;
            const customer = await CustomerController.findById(id);
            return res.status(200).send(customer);
        } catch (e) {
            return res.status(400).send({ error: `Error retrieving customer: ${e.message}` });
        }
    }

    async getAllCustomers(req, res) {
        try {
            const customers = await CustomerController.findAll();
            return res.status(200).send(customers);
        } catch (e) {
            return res.status(400).send({ error: `Error listing customers: ${e.message}` });
        }
    }

    async updateCustomer(req, res) {
        try {
            const { id } = req.params;
            const { name, email, contact, observation, adress, cep } = req.body;
            const customer = await CustomerController.update(id, name, email, contact, observation, adress, cep);
            return res.status(200).send(customer);
        } catch (e) {
            return res.status(400).send({ error: `Error updating customer: ${e.message}` });
        }
    }

    async deleteCustomer(req, res) {
        try {
            const { id } = req.params;
            await CustomerController.delete(id);
            return res.status(204).send();
        } catch (e) {
            return res.status(400).send({ error: `Error deleting customer: ${e.message}` });
        }
    }
}

module.exports = new CustomerApi();
