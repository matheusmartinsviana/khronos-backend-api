jest.mock('../../../utils/googleSheetsClient', () => ({
    getAuthSheets: jest.fn(),
}));

const {
    getSpreadsheetMetadata,
    getRows,
    addRow,
    updateValue,
} = require('../../../services/sheetServiceDataService');

const { getAuthSheets } = require('../../../utils/googleSheetsClient');

describe('Google Sheets Service', () => {
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

        // Setup dos métodos
        mockGoogleSheets.spreadsheets.get.mockResolvedValue({ data: { title: 'Test Sheet' } });
        mockGoogleSheets.spreadsheets.values.get.mockResolvedValue({ data: { values: [['A1', 'B1']] } });
        mockGoogleSheets.spreadsheets.values.append.mockResolvedValue({ data: { updates: {} } });
        mockGoogleSheets.spreadsheets.values.update.mockResolvedValue({ data: { updatedCells: 3 } });
    });

    it('deve retornar metadata da planilha', async () => {
        const result = await getSpreadsheetMetadata();
        expect(result).toEqual({ title: 'Test Sheet' });
    });

    it('deve retornar os valores da planilha', async () => {
        const result = await getRows();
        expect(result.values).toEqual([['A1', 'B1']]);
    });

    it('deve adicionar uma nova linha', async () => {
        const values = [['1', '2']];
        const result = await addRow(values);
        expect(result).toEqual({ updates: {} });
    });

    it('deve atualizar um valor', async () => {
        const values = [['X', 'Y']];
        const result = await updateValue(values);
        expect(result).toEqual({ updatedCells: 3 });
    });
});
