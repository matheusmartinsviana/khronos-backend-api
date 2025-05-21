const sheetService = require("../services/sheetDataService");
const parseSheetData = require("../utils/parseSheetRows");

const getData = async (req, res) => {
    const data = await sheetService.getSpreadsheetMetadata();
    res.send(data);
};

const getRows = async (req, res) => {
    const raw = await sheetService.getRows();
    const structured = parseSheetData(raw.values);
    res.send(structured);
};

const addRow = async (req, res) => {
    const { values } = req.body;
    const result = await sheetService.addRow(values);
    res.send(result);
};

const updateValue = async (req, res) => {
    const { values } = req.body;
    const result = await sheetService.updateValue(values);
    res.send(result);
};

module.exports = { getData, getRows, addRow, updateValue };
