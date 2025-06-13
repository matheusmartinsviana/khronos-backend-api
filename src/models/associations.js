const Sale = require("./SaleModel");
const ProductSale = require("./ProductSaleModel");
const Product = require("./ProductModel");
const CategoryModel = require("./CategoryModel");
const SalespersonModel = require("./SalespersonModel");
const CustomerModel = require("./CustomerModel");
const UserModel = require("./UserModel");
const ServiceModel = require("./ServiceModel");

// ProductSale ↔ Product
ProductSale.belongsTo(Product, {
    foreignKey: "product_id",
    onDelete: "CASCADE"
});
Product.hasMany(ProductSale, {
    foreignKey: "product_id",
    onDelete: "CASCADE"
});

// ProductSale ↔ Service
ProductSale.belongsTo(ServiceModel, {
    foreignKey: "service_id",
    onDelete: "CASCADE"
});
ServiceModel.hasMany(ProductSale, {
    foreignKey: "service_id",
    onDelete: "CASCADE"
});

// ProductSale ↔ Sale
ProductSale.belongsTo(Sale, {
    foreignKey: "sale_id",
    onDelete: "CASCADE"
});
Sale.hasMany(ProductSale, {
    foreignKey: "sale_id",
    onDelete: "CASCADE"
});

// Sale ↔ Salesperson
Sale.belongsTo(SalespersonModel, {
    foreignKey: "seller_id",
    onDelete: "SET NULL"
});
SalespersonModel.hasMany(Sale, {
    foreignKey: "seller_id"
});

// Sale ↔ Customer
Sale.belongsTo(CustomerModel, {
    foreignKey: "customer_id",
    onDelete: "SET NULL"
});
CustomerModel.hasMany(Sale, {
    foreignKey: "customer_id"
});

// Product ↔ Category
Product.belongsTo(CategoryModel, {
    foreignKey: "category_id",
    onDelete: "CASCADE"
});
CategoryModel.hasMany(Product, {
    foreignKey: "category_id"
});

// Salesperson ↔ User
SalespersonModel.belongsTo(UserModel, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
});
UserModel.hasOne(SalespersonModel, {
    foreignKey: "user_id"
});

// Salesperson ↔ Category
SalespersonModel.belongsTo(CategoryModel, {
    foreignKey: "category_id",
    onDelete: "SET NULL"
});
CategoryModel.hasMany(SalespersonModel, {
    foreignKey: "category_id"
});
