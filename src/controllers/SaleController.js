const SaleService = require("../services/SaleService");

const SaleController = {
    create: async (req, res) => {
        try {
            const sale = await SaleService.createSale(req.body);
            res.status(201).json(sale);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const sales = await SaleService.getSales();
            res.status(200).json(sales);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getById: async (req, res) => {
        try {
            const sale = await SaleService.getSaleById(req.params.id);
            res.status(200).json(sale);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    },

    update: async (req, res) => {
        try {
            await SaleService.updateSale(req.params.id, req.body);
            res.status(204).end();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    delete: async (req, res) => {
        try {
            await SaleService.deleteSale(req.params.id);
            res.status(204).end();
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    },
    getSalesById: async (req, res) => {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: "Seller ID is required" });
            }
            const sales = await SaleService.getSalesByCurrentUserId(id);
            res.status(200).json(sales);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = SaleController;
