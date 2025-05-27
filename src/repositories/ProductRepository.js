class ProductRepository {
    constructor(ProductModel) {
        this.ProductModel = ProductModel;
    }

    async create(productData) {
        return await this.ProductModel.create(productData);
    }

    async bulkCreate(productsData) {
        return await this.ProductModel.bulkCreate(productsData);
    }

    async deleteAll() {
        return await this.ProductModel.destroy({ where: {} });
    }

    async findAll() {
        return await this.ProductModel.findAll();
    }
}

module.exports = ProductRepository;
