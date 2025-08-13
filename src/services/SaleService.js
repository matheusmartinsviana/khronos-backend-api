const SaleRepository = require("../repositories/SaleRepository");
const Product = require("../models/ProductModel");
const Service = require("../models/ServiceModel");
const Salesperson = require("../models/SalespersonModel");
const Customer = require("../models/CustomerModel");
const UserModel = require("../models/UserModel");

const SaleService = {
    createSale: async (data) => {
        const {
            seller_id,
            customer_id,
            produtos,
            servicos,
            ...saleData
        } = data;

        // Verificação de vendedor
        const seller = await Salesperson.findByPk(seller_id);
        if (!seller) throw new Error("Vendedor não encontrado");

        // Verificação de cliente
        const customer = await Customer.findByPk(customer_id);
        if (!customer) throw new Error("Cliente não encontrado");

        // Verificação dos produtos (se existirem)
        if (produtos && produtos.length > 0) {
            const productIds = produtos.map(p => p.product_id);
            const existingProducts = await Product.findAll({
                where: { product_id: productIds }
            });

            const foundProductIds = existingProducts.map(p => p.product_id);
            const missingProductIds = productIds.filter(id => !foundProductIds.includes(id));
            if (missingProductIds.length > 0) {
                throw new Error("Um ou mais produtos são inválidos");
            }
        }

        // Verificação dos serviços (se existirem)
        if (servicos && servicos.length > 0) {
            const serviceIds = servicos.map(s => s.service_id);
            const existingServices = await Service.findAll({
                where: { service_id: serviceIds }
            });

            const foundServiceIds = existingServices.map(s => s.service_id);
            const missingServiceIds = serviceIds.filter(id => !foundServiceIds.includes(id));
            if (missingServiceIds.length > 0) {
                throw new Error("Um ou mais serviços são inválidos");
            }
        }

        // Criação da venda
        const sale = await SaleRepository.create({
            ...saleData,
            seller_id,
            customer_id,
        });

        // Criação dos registros em ProductSale
        if (produtos && produtos.length > 0) {
            const productSales = produtos.map(p => ({
                product_id: p.product_id,
                sale_id: sale.sale_id,
                quantity: p.quantidade || 1,
                price: Number(p.price?.toFixed(2)) || 0,
                product_price: Number(p.price?.toFixed(2)) || 0,
                total_sales: Number((p.price * (p.quantidade || 1)).toFixed(2)),
                zoneamento: p.zoneamento || "",
            }));
            await SaleRepository.createProductSales(productSales);
        }

        // Criação dos registros em ServiceSale
        if (servicos && servicos.length > 0) {
            const serviceSales = servicos.map(s => ({
                service_id: s.service_id,
                sale_id: sale.sale_id,
                quantity: s.quantidade || 1,
                price: Number(s.price?.toFixed(2)) || 0,
                service_price: Number(s.price?.toFixed(2)) || 0,
                total_sales: Number((s.price * (s.quantidade || 1)).toFixed(2)),
                zoneamento: s.zoneamento || "",
            }));
            await SaleRepository.createServiceSales(serviceSales);
        }

        return sale;
    },

    getSales: async () => await SaleRepository.findAll(),

    getSaleById: async (id) => {
        const sale = await SaleRepository.findById(id);
        if (!sale) throw new Error("Venda não encontrada");
        return sale;
    },

    getSalesByEnvironment: async (environmentId) => {
        if (!environmentId) throw new Error("Environment ID is required");
        return await SaleRepository.findByEnvironment(environmentId);
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
