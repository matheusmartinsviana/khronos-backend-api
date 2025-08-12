const EnvironmentController = require("../controllers/EnvironmentController")

class EnvironmentApi {
    async createEnvironment(req, res) {
        const { name, description } = req.body

        try {
            const environment = await EnvironmentController.create(name, description)
            return res.status(201).send(environment)
        } catch (e) {
            return res.status(400).send({ error: e.message })
        }
    }

    async updateEnvironment(req, res) {
        const { id } = req.params
        const { name, description } = req.body

        try {
            const environment = await EnvironmentController.update(id, name, description)
            return res.status(200).send(environment)
        } catch (e) {
            return res.status(400).send({ error: `Error updating environment: ${e.message}` })
        }
    }

    async deleteEnvironment(req, res) {
        try {
            const { id } = req.params

            await EnvironmentController.delete(Number(id))
            return res.status(204).send()
        } catch (e) {
            return res.status(400).send({ error: `Error deleting environment: ${e.message}` })
        }
    }

    async findEnvironments(req, res) {
        try {
            const environments = await EnvironmentController.find()
            return res.status(200).send(environments)
        } catch (e) {
            return res.status(400).send({ error: `Error listing environments: ${e.message}` })
        }
    }

    async findEnvironmentById(req, res) {
        const { id } = req.params

        try {
            if (!id) {
                return res.status(400).send({ error: "Id is required" })
            }
            const environment = await EnvironmentController.findEnvironment(id)
            return res.status(200).send(environment)
        } catch (e) {
            return res.status(400).send({ error: `Error to get environment: ${e.message}` })
        }
    }

    async findEnvironmentByName(req, res) {
        const { name } = req.params

        try {
            if (!name) {
                return res.status(400).send({ error: "Name is required" })
            }
            const environment = await EnvironmentController.findByName(name)
            return res.status(200).send(environment)
        } catch (e) {
            return res.status(400).send({ error: `Error to get environment by name: ${e.message}` })
        }
    }

    async bulkCreateEnvironments(req, res) {
        const { environments } = req.body

        try {
            if (!environments || !Array.isArray(environments)) {
                return res.status(400).send({ error: "Environments array is required" })
            }
            const createdEnvironments = await EnvironmentController.bulkCreate(environments)
            return res.status(201).send(createdEnvironments)
        } catch (e) {
            return res.status(400).send({ error: `Error creating environments in bulk: ${e.message}` })
        }
    }

    async getProductsByEnvironment(req, res) {
        const { id } = req.params

        try {
            if (!id) {
                return res.status(400).send({ error: "Environment id is required" })
            }
            const products = await ProductController.getProductsByEnvironment(id)
            return res.status(200).send(products)
        } catch (e) {
            return res.status(400).send({ error: `Error getting products by environment: ${e.message}` })
        }
    }
}

module.exports = new EnvironmentApi()
