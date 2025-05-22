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

module.exports = { getData, getRows, addRow, updateValue };
