const ServiceController = require("../controllers/ServiceController");

class ServiceApi {
    async createService(req, res) {
        try {
            const service = await ServiceController.create(req.body);
            return res.status(201).send(service);
        } catch (e) {
            return res.status(400).send({ error: `Error creating service: ${e.message}` });
        }
    }

    async getServiceById(req, res) {
        try {
            const { id } = req.params;
            const service = await ServiceController.findById(id);
            return res.status(200).send(service);
        } catch (e) {
            return res.status(400).send({ error: `Error retrieving service: ${e.message}` });
        }
    }

    async getAllServices(req, res) {
        try {
            const services = await ServiceController.findAll();
            return res.status(200).send(services);
        } catch (e) {
            return res.status(400).send({ error: `Error listing services: ${e.message}` });
        }
    }

    async updateService(req, res) {
        try {
            const { id } = req.params;
            const updatedService = await ServiceController.update(id, req.body);
            return res.status(200).send(updatedService);
        } catch (e) {
            return res.status(400).send({ error: `Error updating service: ${e.message}` });
        }
    }

    async deleteService(req, res) {
        try {
            const { id } = req.params;
            await ServiceController.delete(id);
            return res.status(204).send();
        } catch (e) {
            return res.status(400).send({ error: `Error deleting service: ${e.message}` });
        }
    }
}

module.exports = new ServiceApi();
