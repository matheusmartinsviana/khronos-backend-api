class ServiceRepository {
    constructor(ServiceModel) {
        this.ServiceModel = ServiceModel;
    }

    async create(serviceData) {
        return await this.ServiceModel.create(serviceData);
    }

    async bulkCreate(servicesData) {
        return await this.ServiceModel.bulkCreate(servicesData);
    }

    async deleteAll() {
        return await this.ServiceModel.destroy({ where: {}, truncate: true });
    }Z

    async findAll() {
        return await this.ServiceModel.findAll();
    }
}

module.exports = ServiceRepository;
