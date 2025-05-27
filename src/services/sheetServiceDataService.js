const { getAuthSheets } = require("../utils/googleSheetsClient");

const getSpreadsheetMetadata = async () => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
    const res = await googleSheets.spreadsheets.get({ auth, spreadsheetId });
    return res.data;
};

const getRows = async () => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
    const res = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Serviços ",
        valueRenderOption: "UNFORMATTED_VALUE",
        dateTimeRenderOption: "FORMATTED_STRING",
    });
    return res.data;
};

const addRow = async (values) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
    const res = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Serviços ",
        valueInputOption: "USER_ENTERED",
        resource: { values },
    });
    return res.data;
};

const updateValue = async (values) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
    const res = await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "Serviços!A2:C2",
        valueInputOption: "USER_ENTERED",
        resource: { values },
    });
    return res.data;
};

module.exports = { getSpreadsheetMetadata, getRows, addRow, updateValue };
