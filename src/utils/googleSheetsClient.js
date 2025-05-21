const { google } = require("googleapis");

async function getAuthSheets() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = "1b4n9fbAcMnzUTJhqpp7OvISDpdlyyjQATL7p68piLmU";

    return { googleSheets, auth, spreadsheetId };
}

module.exports = { getAuthSheets };
