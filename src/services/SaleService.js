const SaleRepository = require("../repositories/SaleRepository");
const Product = require("../models/ProductModel");
const Service = require("../models/ServiceModel");
const Salesperson = require("../models/SalespersonModel");
const Customer = require("../models/CustomerModel");
const UserModel = require("../models/UserModel");

const SaleService = {
    createSale: async (data) => {
        const { seller_id, customer_id, products, ...saleData } = data;

        const seller = await Salesperson.findByPk(seller_id);
        if (!seller) throw new Error("Vendedor não encontrado");

        const customer = await Customer.findByPk(customer_id);
        if (!customer) throw new Error("Cliente não encontrado");

        if (products && products.length > 0) {
            const productIds = products
                .filter(p => p.product_id)
                .map(p => p.product_id);

            const serviceIds = products
                .filter(p => p.service_id)
                .map(p => p.service_id);

            let foundProductIds = [];
            let foundServiceIds = [];

            if (productIds.length > 0) {
                const existingProducts = await Product.findAll({
                    where: { product_id: productIds }
                });
                foundProductIds = existingProducts.map(p => p.product_id);
            }

            if (serviceIds.length > 0) {
                const existingServices = await Service.findAll({
                    where: { service_id: serviceIds }
                });
                foundServiceIds = existingServices.map(s => s.service_id);
            }

            // Check for missing products/services
            const missingProductIds = productIds.filter(id => !foundProductIds.includes(id));
            const missingServiceIds = serviceIds.filter(id => !foundServiceIds.includes(id));

            if (missingProductIds.length > 0 || missingServiceIds.length > 0) {
                throw new Error("Um ou mais produtos/serviços são inválidos");
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
    },
    getSalesByCurrentUserId: async (userId) => {

        if (!userId || isNaN(userId)) {
            throw new Error(`ID do usuário inválido: ${userId}`);
        }

        let salesperson = await Salesperson.findOne({ where: { user_id: userId } });

        if (!salesperson) {
            const user = await UserModel.findByPk(userId);
            if (!user) {
                throw new Error(`Usuário não encontrado para user_id: ${userId}`);
            }
            if (user.role === "admin" || user.role === "salesperson") {
                // Cria um novo salesperson para o usuário
                const newSalesperson = await Salesperson.create({ user_id: userId, name: user.name });
                // Atualiza a referência para o novo salesperson
                salesperson = newSalesperson;
            } else {
                throw new Error(`Vendedor não encontrado para user_id: ${userId}`);
            }
        }

        const sales = await SaleRepository.findBySellerId(salesperson.seller_id);

        if (!sales || sales.length === 0) {
            return [];
        }

        return sales;
    }
};

module.exports = SaleService;
