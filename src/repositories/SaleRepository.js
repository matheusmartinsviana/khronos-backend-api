const Sale = require("../models/SaleModel");
const ProductSale = require("../models/ProductSaleModel");

const SaleRepository = {
    create: async (data) => await Sale.create(data),

    createProductSales: async (productSales) => await ProductSale.bulkCreate(productSales),

    findAll: () => Sale.findAll({ include: [ProductSale] }),

    findById: (id) => Sale.findByPk(id, { include: [ProductSale] }),

    update: (id, data) => Sale.update(data, { where: { sale_id: id } }),

    delete: async (id) => {
        await ProductSale.destroy({ where: { sale_id: id } });
        return Sale.destroy({ where: { sale_id: id } });
    },
    findBySellerId: async (sellerId) => {
        if (!sellerId || isNaN(sellerId)) {
            throw new Error(`Invalid sellerId: ${sellerId}`);
        }

        return Sale.findAll({
            where: { seller_id: sellerId },
            include: [ProductSale],
        });
    }
};

module.exports = SaleRepository;
