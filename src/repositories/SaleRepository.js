const Sale = require("../models/SaleModel");
const ProductSale = require("../models/ProductSaleModel");
const SalespersonModel = require("../models/SalespersonModel");
const CustomerModel = require("../models/CustomerModel");
const ProductModel = require("../models/ProductModel");
const UserModel = require("../models/UserModel");
const ServiceModel = require("../models/ServiceModel");
const ServiceSale = require("../models/ServiceSaleModel");

const SaleRepository = {
    create: async (data) => await Sale.create(data),

    createProductSales: async (productSales) => {
        return await ProductSale.bulkCreate(productSales);
    },

    createServiceSales: async (serviceSales) => {
        return await ServiceSale.bulkCreate(serviceSales);
    },


    findAll: () => Sale.findAll({
        attributes: ['sale_id', 'amount', 'sale_type', 'date', 'payment_method'],
        include: [
            {
                model: ProductSale,
                attributes: ['product_sale_id', 'product_price', 'total_sales', 'quantity', 'zoning'],
                include: [
                    {
                        model: ProductModel,
                        attributes: ['product_id', 'name', 'price', 'description', 'image'],
                    },
                ]
            },
            {
                model: ServiceSale,
                attributes: ['service_sale_id', 'service_price', 'total_sales', 'quantity', 'zoning'],
                include: [
                    {
                        model: ServiceModel,
                        attributes: ['service_id', 'name', 'price', 'description'],
                    }
                ]
            },
            {
                model: SalespersonModel,
                attributes: ['seller_id', 'user_id'],
                include: [
                    {
                        model: UserModel,
                        attributes: ['user_id', 'name', 'email'],
                    }
                ]
            },
            {
                model: CustomerModel,
                attributes: ['customer_id', 'name', 'email', 'contact', 'adress'],
            }
        ]
    }),

    findByEnvironment: async (environmentId) => {
        if (!environmentId) throw new Error("Environment ID is required");
        return await Sale.findAll({ where: { environment_id: environmentId } });
    },

    update: (id, data) => Sale.update(data, { where: { sale_id: id } }),

    delete: async (id) => {
        await ProductSale.destroy({ where: { sale_id: id } });
        return Sale.destroy({ where: { sale_id: id } });
    },

    findById: (id) => Sale.findByPk(id, {
        attributes: ['sale_id', 'amount', 'sale_type', 'date', 'payment_method'],
        include: [
            {
                model: ProductSale,
                attributes: ['product_sale_id', 'product_price', 'total_sales', 'quantity', 'zoning'],
                include: [
                    {
                        model: ProductModel,
                        attributes: ['product_id', 'name', 'price', 'description', 'image'],
                    },
                ]
            },
            {
                model: ServiceSale,
                attributes: ['service_sale_id', 'service_price', 'total_sales', 'quantity', 'zoning'],
                include: [
                    {
                        model: ServiceModel,
                        attributes: ['service_id', 'name', 'price', 'description'],
                    }
                ]
            },
            {
                model: SalespersonModel,
                attributes: ['seller_id', 'user_id'],
                include: [
                    {
                        model: UserModel,
                        attributes: ['user_id', 'name', 'email'],
                    }
                ]
            },
            {
                model: CustomerModel,
                attributes: ['customer_id', 'name', 'email', 'contact', 'adress'],
            }
        ]
    }),

    findBySellerId: async (sellerId) => {
        if (!sellerId || isNaN(sellerId)) {
            throw new Error(`Invalid sellerId: ${sellerId}`);
        }

        return Sale.findAll({
            where: { seller_id: sellerId },
            attributes: ['sale_id', 'amount', 'sale_type', 'date', 'payment_method'],
            include: [
                {
                    model: ProductSale,
                    attributes: ['product_sale_id', 'product_price', 'total_sales', 'quantity', 'zoning'],
                    include: [
                        {
                            model: ProductModel,
                            attributes: ['product_id', 'name', 'price', 'description', 'image'],
                        },
                    ]
                },
                {
                    model: ServiceSale,
                    attributes: ['service_sale_id', 'service_price', 'total_sales', 'quantity', 'zoning'],
                    include: [
                        {
                            model: ServiceModel,
                            attributes: ['service_id', 'name', 'price', 'description'],
                        }
                    ]
                },
                {
                    model: SalespersonModel,
                    attributes: ['seller_id', 'user_id'],
                    include: [
                        {
                            model: UserModel,
                            attributes: ['user_id', 'name', 'email'],
                        }
                    ]
                },
                {
                    model: CustomerModel,
                    attributes: ['customer_id', 'name', 'email', 'contact', 'adress'],
                }
            ],
        });
    },
};

module.exports = SaleRepository;
