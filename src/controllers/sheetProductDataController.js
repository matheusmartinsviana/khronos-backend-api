const importProductsFromSheet = require("../services/import/importProductsFromSheet");
const sheetProductDataService = require("../services/sheetProductDataService");
const parseSheetData = require("../utils/parseSheetRows");

const getData = async (req, res) => {
    const data = await sheetProductDataService.getSpreadsheetMetadata();
    res.send(data);
};

const getRows = async (req, res) => {
    const raw = await sheetProductDataService.getRows();
    const structured = parseSheetData(raw.values);
    res.send(structured);
};

const addRow = async (req, res) => {
    const { values } = req.body;
    const result = await sheetProductDataService.addRow(values);
    res.send(result);
};

const updateValue = async (req, res) => {
    const { values } = req.body;
    const result = await sheetProductDataService.updateValue(values);
    res.send(result);
};

const importProductController = async (req, res) => {
    try {
        const result = await importProductsFromSheet();
        res.status(200).json({ message: "Produtos importados com sucesso", data: result });
    } catch (err) {
        res.status(500).json({ message: "Erro ao importar", error: err.message });
    }
};

module.exports = { getData, getRows, addRow, updateValue, importProductController };
