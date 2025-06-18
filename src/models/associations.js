const sequelize = require("../config/Database");

const User = require("./UserModel");
const Salesperson = require("./SalespersonModel");
const Category = require("./CategoryModel");
const Customer = require("./CustomerModel");
const Product = require("./ProductModel");
const Service = require("./ServiceModel");
const Sale = require("./SaleModel");
const ProductSale = require("./ProductSaleModel");
const ServiceSale = require("./ServiceSaleModel");

// USER ↔ SALESPERSON (1:1)
User.hasOne(Salesperson, { foreignKey: "user_id", onDelete: "CASCADE" });
Salesperson.belongsTo(User, { foreignKey: "user_id" });

// CATEGORY ↔ SALESPERSON (1:N)
Category.hasMany(Salesperson, { foreignKey: "category_id" });
Salesperson.belongsTo(Category, { foreignKey: "category_id", onDelete: "SET NULL" });

// CATEGORY ↔ PRODUCT (1:N)
Category.hasMany(Product, { foreignKey: "category_id" });
Product.belongsTo(Category, { foreignKey: "category_id", onDelete: "CASCADE" });

// CUSTOMER ↔ SALE (1:N)
Customer.hasMany(Sale, { foreignKey: "customer_id" });
Sale.belongsTo(Customer, { foreignKey: "customer_id", onDelete: "SET NULL" });

// SALESPERSON ↔ SALE (1:N)
Salesperson.hasMany(Sale, { foreignKey: "seller_id" });
Sale.belongsTo(Salesperson, { foreignKey: "seller_id", onDelete: "SET NULL" });

// SALE ↔ PRODUCT_SALE (1:N)
Sale.hasMany(ProductSale, { foreignKey: "sale_id", onDelete: "CASCADE" });
ProductSale.belongsTo(Sale, { foreignKey: "sale_id" });

// PRODUCT ↔ PRODUCT_SALE (1:N)
Product.hasMany(ProductSale, { foreignKey: "product_id", onDelete: "CASCADE" });
ProductSale.belongsTo(Product, { foreignKey: "product_id" });

// SALE ↔ SERVICE_SALE (1:N)
Sale.hasMany(ServiceSale, { foreignKey: "sale_id", onDelete: "CASCADE" });
ServiceSale.belongsTo(Sale, { foreignKey: "sale_id" });

// SERVICE ↔ SERVICE_SALE (1:N)
Service.hasMany(ServiceSale, { foreignKey: "service_id", onDelete: "CASCADE" });
ServiceSale.belongsTo(Service, { foreignKey: "service_id" });

module.exports = {
    sequelize,
    User,
    Salesperson,
    Category,
    Customer,
    Product,
    Service,
    Sale,
    ProductSale,
    ServiceSale
};
