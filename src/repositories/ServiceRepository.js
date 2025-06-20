const ServiceModel = require("../models/ServiceModel");

const ServiceRepository = {
    create: async (data) => await ServiceModel.create(data),

    findAll: () => ServiceModel.findAll(),

    findById: (id) => ServiceModel.findByPk(id),

    update: (id, data) => ServiceModel.update(data, { where: { service_id: id } }),

    delete: (id) => ServiceModel.destroy({ where: { service_id: id } }),
};

module.exports = ServiceRepository;
