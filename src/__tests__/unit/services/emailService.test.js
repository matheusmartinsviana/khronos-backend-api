jest.mock('../../../repositories/emailRepository', () => ({
    sendCustomerSaleReport: jest.fn(),
    sendSellerSaleNotification: jest.fn(),
}));

const {
    handleCustomerReport,
    handleSellerNotification,
    handleBoth,
} = require('../../../services/emailService');

const {
    sendCustomerSaleReport,
    sendSellerSaleNotification,
} = require('../../../repositories/emailRepository');

describe('Email Service', () => {
    const mockData = {
        customerEmail: 'cliente@email.com',
        customerName: 'Cliente Exemplo',
        sellerEmail: 'vendedor@email.com',
        sellerName: 'Vendedor Exemplo',
        saleData: { total: 200, date: '2025-06-19' },
        customerData: { id: 1, name: 'Cliente Exemplo' },
        reportHTML: '<h1>Relatório</h1>',
        saleItems: [{ name: 'Produto 1', price: 100 }],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve enviar o relatório para o cliente com sucesso', async () => {
        sendCustomerSaleReport.mockResolvedValue(true);
        const result = await handleCustomerReport(mockData);
        expect(result).toBe(true);
        expect(sendCustomerSaleReport).toHaveBeenCalledWith(
            mockData.customerEmail,
            mockData.customerName,
            mockData.saleData,
            mockData.reportHTML
        );
    });

    it('deve enviar a notificação para o vendedor com sucesso', async () => {
        sendSellerSaleNotification.mockResolvedValue(true);
        const result = await handleSellerNotification(mockData);
        expect(result).toBe(true);
        expect(sendSellerSaleNotification).toHaveBeenCalledWith(
            mockData.sellerEmail,
            mockData.sellerName,
            mockData.saleData,
            mockData.customerData,
            mockData.saleItems
        );
    });

    it('deve lidar com envio de ambos os e-mails com sucesso', async () => {
        sendCustomerSaleReport.mockResolvedValue(true);
        sendSellerSaleNotification.mockResolvedValue(true);

        const result = await handleBoth(mockData);
        expect(result).toEqual({
            success: true,
            customerSent: true,
            sellerSent: true,
        });
    });

    it('deve lidar com falha ao enviar o e-mail para o cliente', async () => {
        sendCustomerSaleReport.mockRejectedValue(new Error('Falha no cliente'));
        sendSellerSaleNotification.mockResolvedValue(true);

        const result = await handleBoth(mockData);
        expect(result).toEqual({
            success: true,
            customerSent: false,
            sellerSent: true,
        });
    });

    it('deve lidar com falha ao enviar o e-mail para o vendedor', async () => {
        sendCustomerSaleReport.mockResolvedValue(true);
        sendSellerSaleNotification.mockRejectedValue(new Error('Falha no vendedor'));

        const result = await handleBoth(mockData);
        expect(result).toEqual({
            success: true,
            customerSent: true,
            sellerSent: false,
        });
    });

    it('deve lidar com falha em ambos os envios', async () => {
        sendCustomerSaleReport.mockRejectedValue(new Error('Erro 1'));
        sendSellerSaleNotification.mockRejectedValue(new Error('Erro 2'));

        const result = await handleBoth(mockData);
        expect(result).toEqual({
            success: false,
            customerSent: false,
            sellerSent: false,
        });
    });
});
