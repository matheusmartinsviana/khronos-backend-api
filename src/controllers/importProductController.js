const importProductsFromSheet = require("../services/importProductsFromSheet");

const importProductController = async (req, res) => {
    try {
        const result = await importProductsFromSheet();
        res.status(200).json({ message: "Importado com sucesso", data: result });
    } catch (err) {
        res.status(500).json({ message: "Erro ao importar", error: err.message });
    }
};

module.exports = importProductController;
