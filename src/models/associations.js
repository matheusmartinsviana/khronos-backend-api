const Sale = require("./SaleModel");
const ProductSale = require("./ProductSaleModel");
const Product = require("./ProductModel");
const CategoryModel = require("./CategoryModel");
const SalespersonModel = require("./SalespersonModel");
const CustomerModel = require("./CustomerModel");
const UserModel = require("./UserModel");

// Associações de ProductSale
ProductSale.belongsTo(Product, { foreignKey: "product_id", onDelete: "CASCADE" });
ProductSale.belongsTo(Sale, { foreignKey: "sale_id", onDelete: "CASCADE" });

// Associações de Sale
Sale.hasMany(ProductSale, { foreignKey: "sale_id", onDelete: "CASCADE" });
Sale.belongsTo(SalespersonModel, { foreignKey: "seller_id", onDelete: "SET NULL" });
Sale.belongsTo(CustomerModel, { foreignKey: "customer_id", onDelete: "SET NULL" });
Sale.belongsTo(Product, { foreignKey: "product_id", onDelete: "SET NULL" });

// Associações de Product
Product.belongsTo(CategoryModel, { foreignKey: 'category_id', onDelete: 'CASCADE' });

// Associações de Salesperson
SalespersonModel.belongsTo(UserModel, { foreignKey: "user_id", onDelete: "CASCADE" });
SalespersonModel.belongsTo(CategoryModel, { foreignKey: "category_id", onDelete: "SET NULL" });

// User → Salesperson
UserModel.hasOne(SalespersonModel, { foreignKey: "user_id" });

// Customer → Sale
CustomerModel.hasMany(Sale, { foreignKey: "customer_id" });