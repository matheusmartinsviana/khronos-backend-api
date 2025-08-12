const CategoryModel = require("../models/CategoryModel");
const Environment = require("../models/EnvironmentModel");

async function ensureDefaultCategory() {
    try {
        let category = await CategoryModel.findOne();
        if (!category) {
            category = await CategoryModel.create({
                name: "general",
            });
            console.log("✅ Categoria padrão criada:", category.name);
        }
        return category;
    } catch (error) {
        console.error("❌ Erro ao garantir categoria padrão:", error);
        throw error;
    }
}

async function ensureDefaultEnvironment() {
    try {
        let environment = await Environment.findOne();
        if (!environment) {
            environment = await Environment.create({
                name: "general",
                description: "Primeiro ambiente criado automaticamente"
            });
            console.log("✅ Ambiente padrão criado:", environment.name);
        }
        return environment;
    } catch (error) {
        console.error("❌ Erro ao garantir ambiente padrão:", error);
        throw error;
    }
}

module.exports = {
    ensureDefaultCategory,
    ensureDefaultEnvironment
};