function parseSheetData(rows) {
    if (!rows || rows.length < 2) return [];

    const headers = rows[0];
    const dataRows = rows.slice(1);

    return dataRows.map(row => {
        const item = {};
        headers.forEach((header, i) => {
            let value = row[i] ?? "";

            if (header === "VALOR") {
                // remove 'R$' e converte para float
                value = parseFloat(String(value).replace('R$', '').replace(',', '.').trim()) || 0;
            }

            item[header] = value;
        });
        return item;
    });
}

module.exports = parseSheetData;
