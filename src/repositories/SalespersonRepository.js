const SalespersonModel = require("../models/SalespersonModel");
const UserModel = require("../models/UserModel");

const SalespersonRepository = {
    findAll: async () => await SalespersonModel.findAll({
        include: [
            {
                model: UserModel,
                attributes: ['user_id', 'name', 'email'],
            }
        ]
    }),
};

module.exports = SalespersonRepository;