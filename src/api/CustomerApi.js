const CustomerController = require("../controllers/CustomerController");

class CustomerApi {
    _validateId(id) {
        if (!id || isNaN(Number(id))) {
            throw new Error("Valid ID is required");
        }
        return Number(id);
    }

    _validateCustomerData(data) {
        const { name, email, contact, observation, adress, cep } = data;

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new Error("Valid name is required");
        }

        if (!email || typeof email !== 'string' || !this._isValidEmail(email.trim())) {
            throw new Error("Valid email is required");
        }

        if (contact && typeof contact !== 'string') {
            throw new Error("Contact must be a valid string");
        }

        if (cep && (typeof cep !== 'string' || !this._isValidCEP(cep.trim()))) {
            throw new Error("Valid CEP format is required");
        }

        return {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            contact: contact?.trim() || null,
            observation: observation?.trim() || null,
            adress: adress?.trim() || null,
            cep: cep?.trim() || null
        };
    }

    _isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    _isValidCEP(cep) {
        const cepRegex = /^\d{5}-?\d{3}$/;
        return cepRegex.test(cep);
    }

    _handleError(res, error, defaultMessage = "Internal server error") {
        console.error(`CustomerApi Error: ${error.message}`, error);

        const statusCode = error.statusCode || 400;
        const message = error.message || defaultMessage;

        return res.status(statusCode).json({
            error: message,
            timestamp: new Date().toISOString()
        });
    }

    async createCustomer(req, res) {
        try {
            const validatedData = this._validateCustomerData(req.body);

            const customer = await CustomerController.create(
                validatedData.name,
                validatedData.email,
                validatedData.contact,
                validatedData.observation,
                validatedData.adress,
                validatedData.cep
            );

            return res.status(201).json({
                success: true,
                data: customer,
                message: "Customer created successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error creating customer");
        }
    }

    async getCustomerById(req, res) {
        try {
            const id = this._validateId(req.params.id);

            const customer = await CustomerController.findById(id);

            if (!customer) {
                return res.status(404).json({
                    success: false,
                    error: "Customer not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: customer,
                message: "Customer retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error retrieving customer");
        }
    }

    async getAllCustomers(req, res) {
        try {
            const { page = 1, limit = 10, search, email } = req.query;
            const options = {
                page: Number(page),
                limit: Number(limit),
                search: search?.trim(),
                email: email?.trim()
            };

            const customers = await CustomerController.findAll(options);

            return res.status(200).json({
                success: true,
                data: customers,
                message: "Customers retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error listing customers");
        }
    }

    async updateCustomer(req, res) {
        try {
            const id = this._validateId(req.params.id);
            const validatedData = this._validateCustomerData(req.body);

            const customer = await CustomerController.update(
                id,
                validatedData.name,
                validatedData.email,
                validatedData.contact,
                validatedData.observation,
                validatedData.adress,
                validatedData.cep
            );

            if (!customer) {
                return res.status(404).json({
                    success: false,
                    error: "Customer not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: customer,
                message: "Customer updated successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error updating customer");
        }
    }

    async deleteCustomer(req, res) {
        try {
            const id = this._validateId(req.params.id);

            const deleted = await CustomerController.delete(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    error: "Customer not found"
                });
            }

            return res.status(204).send();
        } catch (error) {
            return this._handleError(res, error, "Error deleting customer");
        }
    }

    async getCustomerByEmail(req, res) {
        try {
            const { email } = req.params;

            if (!email || !this._isValidEmail(email)) {
                return res.status(400).json({
                    success: false,
                    error: "Valid email is required"
                });
            }

            const customer = await CustomerController.findByEmail(email.toLowerCase());

            if (!customer) {
                return res.status(404).json({
                    success: false,
                    error: "Customer not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: customer,
                message: "Customer retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error retrieving customer by email");
        }
    }

    async bulkCreateCustomers(req, res) {
        try {
            const { customers } = req.body;

            if (!customers || !Array.isArray(customers) || customers.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: "Valid customers array is required"
                });
            }

            const validatedCustomers = customers.map(customer =>
                this._validateCustomerData(customer)
            );

            const createdCustomers = await CustomerController.bulkCreate(validatedCustomers);

            return res.status(201).json({
                success: true,
                data: createdCustomers,
                message: `${createdCustomers.length} customers created successfully`
            });
        } catch (error) {
            return this._handleError(res, error, "Error creating customers in bulk");
        }
    }

    async getCustomerOrders(req, res) {
        try {
            const id = this._validateId(req.params.id);
            const { page = 1, limit = 10 } = req.query;

            const options = {
                page: Number(page),
                limit: Number(limit)
            };

            const orders = await CustomerController.getCustomerOrders(id, options);

            return res.status(200).json({
                success: true,
                data: orders,
                message: "Customer orders retrieved successfully"
            });
        } catch (error) {
            return this._handleError(res, error, "Error retrieving customer orders");
        }
    }
}

module.exports = new CustomerApi();
