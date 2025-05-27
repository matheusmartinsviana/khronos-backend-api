const importServicesFromSheet = require("../services/import/importServicesFromSheet");
const sheetServiceDataService = require("../services/sheetServiceDataService");
const parseSheetData = require("../utils/parseSheetRows");

const getData = async (req, res) => {
    const data = await sheetServiceDataService.getSpreadsheetMetadata();
    res.send(data);
};

const getRows = async (req, res) => {
    const raw = await sheetServiceDataService.getRows();
    const structured = parseSheetData(raw.values);
    res.send(structured);
};

const addRow = async (req, res) => {
    const { values } = req.body;
    const result = await sheetServiceDataService.addRow(values);
    res.send(result);
};

const updateValue = async (req, res) => {
    const { values } = req.body;
    const result = await sheetServiceDataService.updateValue(values);
    res.send(result);
};

const importServiceController = async (req, res) => {
    try {
        const result = await importServicesFromSheet();
        res.status(200).json({ message: "Serviços importados com sucesso", data: result });
    } catch (err) {
        res.status(500).json({ message: "Erro ao importar", error: err.message });
    }
};

module.exports = { getData, getRows, addRow, updateValue, importServiceController };
