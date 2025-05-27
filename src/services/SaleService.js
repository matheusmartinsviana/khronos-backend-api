const SaleRepository = require("../repositories/SaleRepository");
const Product = require("../models/ProductModel");
const Salesperson = require("../models/SalespersonModel");
const Customer = require("../models/CustomerModel");

const SaleService = {
    createSale: async (data) => {
        const { seller_id, customer_id, products, ...saleData } = data;

        const seller = await Salesperson.findByPk(seller_id);
        if (!seller) throw new Error("Vendedor não encontrado");

        const customer = await Customer.findByPk(customer_id);
        if (!customer) throw new Error("Cliente não encontrado");

        if (products && products.length > 0) {
            const productIds = products.map(p => p.product_id);
            const existingProducts = await Product.findAll({ where: { product_id: productIds } });

            if (existingProducts.length !== productIds.length) {
                throw new Error("Um ou mais produtos são inválidos");
            }
        }

        const sale = await SaleRepository.create({ ...saleData, seller_id, customer_id });

        if (products && products.length > 0) {
            const productSales = products.map(p => ({
                ...p,
                sale_id: sale.sale_id
            }));
            await SaleRepository.createProductSales(productSales);
        }

        return sale;
    },

    getSales: async () => await SaleRepository.findAll(),

    getSaleById: async (id) => {
        const sale = await SaleRepository.findById(id);
        if (!sale) throw new Error("Venda não encontrada");
        return sale;
    },

    updateSale: async (id, data) => {
        await SaleService.getSaleById(id);
        return await SaleRepository.update(id, data);
    },

    deleteSale: async (id) => {
        await SaleService.getSaleById(id);
        return await SaleRepository.delete(id);
    }
};

module.exports = SaleService;
