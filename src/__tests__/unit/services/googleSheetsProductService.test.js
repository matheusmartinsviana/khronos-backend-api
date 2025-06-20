jest.mock('../../../utils/googleSheetsClient', () => ({
    getAuthSheets: jest.fn(),
}));

const { getAuthSheets } = require('../../../utils/googleSheetsClient');
const {
    getSpreadsheetMetadata,
    getRows,
    addRow,
    updateValue,
} = require('../../../services/sheetProductDataService'); // ou googleSheetsProductService.js, se você separar

describe('Google Sheets Product Service', () => {
    const mockGoogleSheets = {
        spreadsheets: {
            get: jest.fn(),
            values: {
                get: jest.fn(),
                append: jest.fn(),
                update: jest.fn(),
            },
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();

        getAuthSheets.mockResolvedValue({
            googleSheets: mockGoogleSheets,
            auth: 'mockAuth',
            spreadsheetId: 'mockSpreadsheetId',
        });

        mockGoogleSheets.spreadsheets.get.mockResolvedValue({
            data: { title: 'Planilha de Produtos' },
        });

        mockGoogleSheets.spreadsheets.values.get.mockResolvedValue({
            data: { values: [['Produto A', 10, 25.5]] },
        });

        mockGoogleSheets.spreadsheets.values.append.mockResolvedValue({
            data: { updates: { updatedRange: 'Página22!A5' } },
        });

        mockGoogleSheets.spreadsheets.values.update.mockResolvedValue({
            data: { updatedCells: 3 },
        });
    });

    it('deve retornar os metadados da planilha de produtos', async () => {
        const result = await getSpreadsheetMetadata();
        expect(result).toEqual({ title: 'Planilha de Produtos' });
        expect(mockGoogleSheets.spreadsheets.get).toHaveBeenCalledWith({
            auth: 'mockAuth',
            spreadsheetId: 'mockSpreadsheetId',
        });
    });

    it('deve retornar as linhas da planilha de produtos', async () => {
        const result = await getRows();
        expect(result.values).toEqual([['Produto A', 10, 25.5]]);
        expect(mockGoogleSheets.spreadsheets.values.get).toHaveBeenCalledWith({
            auth: 'mockAuth',
            spreadsheetId: 'mockSpreadsheetId',
            range: 'Página22',
            valueRenderOption: 'UNFORMATTED_VALUE',
            dateTimeRenderOption: 'FORMATTED_STRING',
        });
    });

    it('deve adicionar uma nova linha de produto', async () => {
        const values = [['Produto B', 5, 12.75]];
        const result = await addRow(values);
        expect(result.updates.updatedRange).toBe('Página22!A5');
        expect(mockGoogleSheets.spreadsheets.values.append).toHaveBeenCalledWith({
            auth: 'mockAuth',
            spreadsheetId: 'mockSpreadsheetId',
            range: 'Página22',
            valueInputOption: 'USER_ENTERED',
            resource: { values },
        });
    });

    it('deve atualizar uma linha de produto existente', async () => {
        const values = [['Produto Atualizado', 3, 30.0]];
        const result = await updateValue(values);
        expect(result.updatedCells).toBe(3);
        expect(mockGoogleSheets.spreadsheets.values.update).toHaveBeenCalledWith({
            auth: 'mockAuth',
            spreadsheetId: 'mockSpreadsheetId',
            range: 'Página22!A2:C2',
            valueInputOption: 'USER_ENTERED',
            resource: { values },
        });
    });
});
