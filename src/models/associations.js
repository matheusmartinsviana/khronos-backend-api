const Sale = require("./SaleModel");
const ProductSale = require("./ProductSaleModel");
const Product = require("./ProductModel");
const CategoryModel = require("./CategoryModel");
const SalespersonModel = require("./SalespersonModel");
const CustomerModel = require("./CustomerModel");
const UserModel = require("./UserModel");

// ProductSale ↔ Product, Sale
ProductSale.belongsTo(Product, { foreignKey: "product_id", onDelete: "CASCADE" });
ProductSale.belongsTo(Sale, { foreignKey: "sale_id", onDelete: "CASCADE" });

Product.hasMany(ProductSale, { foreignKey: "product_id", onDelete: "CASCADE" });
Sale.hasMany(ProductSale, { foreignKey: "sale_id", onDelete: "CASCADE" });

// Sale ↔ Salesperson, Customer
Sale.belongsTo(SalespersonModel, { foreignKey: "seller_id", onDelete: "SET NULL" });
Sale.belongsTo(CustomerModel, { foreignKey: "customer_id", onDelete: "SET NULL" });

CustomerModel.hasMany(Sale, { foreignKey: "customer_id" });
SalespersonModel.hasMany(Sale, { foreignKey: "seller_id" });

// Product ↔ Category
Product.belongsTo(CategoryModel, { foreignKey: 'category_id', onDelete: 'CASCADE' });
CategoryModel.hasMany(Product, { foreignKey: 'category_id' });

// Salesperson ↔ User, Category
SalespersonModel.belongsTo(UserModel, { foreignKey: "user_id", onDelete: "CASCADE" });
UserModel.hasOne(SalespersonModel, { foreignKey: "user_id" });

SalespersonModel.belongsTo(CategoryModel, { foreignKey: "category_id", onDelete: "SET NULL" });
CategoryModel.hasMany(SalespersonModel, { foreignKey: "category_id" });
