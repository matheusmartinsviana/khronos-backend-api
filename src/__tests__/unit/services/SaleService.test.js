const SaleService = require('../../../services/SaleService');
const SaleRepository = require('../../../repositories/SaleRepository');
const Product = require('../../../models/ProductModel');
const Service = require('../../../models/ServiceModel');
const Salesperson = require('../../../models/SalespersonModel');
const Customer = require('../../../models/CustomerModel');
const UserModel = require('../../../models/UserModel');

jest.mock('../../../repositories/SaleRepository');
jest.mock('../../../models/ProductModel');
jest.mock('../../../models/ServiceModel');
jest.mock('../../../models/SalespersonModel');
jest.mock('../../../models/CustomerModel');
jest.mock('../../../models/UserModel');

describe('SaleService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const sampleData = {
        seller_id: 1,
        customer_id: 2,
        produtos: [{ product_id: 1, quantidade: 2, price: 100.0 }],
        servicos: [{ service_id: 1, quantidade: 1, price: 50.0 }],
        additional_field: "valor",
    };

    describe('createSale', () => {
        it('deve criar uma venda com produtos e serviços válidos', async () => {
            Salesperson.findByPk.mockResolvedValue({ seller_id: 1 });
            Customer.findByPk.mockResolvedValue({ customer_id: 2 });

            Product.findAll.mockResolvedValue([{ product_id: 1 }]);
            Service.findAll.mockResolvedValue([{ service_id: 1 }]);

            SaleRepository.create.mockResolvedValue({ sale_id: 10 });

            SaleRepository.createProductSales.mockResolvedValue(true);
            SaleRepository.createServiceSales.mockResolvedValue(true);

            const result = await SaleService.createSale(sampleData);
            expect(result.sale_id).toBe(10);
            expect(SaleRepository.createProductSales).toHaveBeenCalled();
            expect(SaleRepository.createServiceSales).toHaveBeenCalled();
        });

        it('deve lançar erro se o vendedor não existir', async () => {
            Salesperson.findByPk.mockResolvedValue(null);
            await expect(SaleService.createSale(sampleData)).rejects.toThrow("Vendedor não encontrado");
        });

        it('deve lançar erro se o cliente não existir', async () => {
            Salesperson.findByPk.mockResolvedValue({});
            Customer.findByPk.mockResolvedValue(null);
            await expect(SaleService.createSale(sampleData)).rejects.toThrow("Cliente não encontrado");
        });

        it('deve lançar erro se algum produto for inválido', async () => {
            Salesperson.findByPk.mockResolvedValue({});
            Customer.findByPk.mockResolvedValue({});
            Product.findAll.mockResolvedValue([]); // nenhum produto válido
            await expect(SaleService.createSale(sampleData)).rejects.toThrow("Um ou mais produtos são inválidos");
        });

        it('deve lançar erro se algum serviço for inválido', async () => {
            Salesperson.findByPk.mockResolvedValue({});
            Customer.findByPk.mockResolvedValue({});
            Product.findAll.mockResolvedValue([{ product_id: 1 }]);
            Service.findAll.mockResolvedValue([]); // nenhum serviço válido
            await expect(SaleService.createSale(sampleData)).rejects.toThrow("Um ou mais serviços são inválidos");
        });
    });

    describe('getSales', () => {
        it('deve retornar todas as vendas', async () => {
            SaleRepository.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
            const result = await SaleService.getSales();
            expect(result.length).toBe(2);
        });
    });

    describe('getSaleById', () => {
        it('deve retornar a venda se existir', async () => {
            SaleRepository.findById.mockResolvedValue({ sale_id: 1 });
            const sale = await SaleService.getSaleById(1);
            expect(sale.sale_id).toBe(1);
        });

        it('deve lançar erro se a venda não existir', async () => {
            SaleRepository.findById.mockResolvedValue(null);
            await expect(SaleService.getSaleById(1)).rejects.toThrow("Venda não encontrada");
        });
    });

    describe('updateSale', () => {
        it('deve atualizar uma venda existente', async () => {
            SaleRepository.findById.mockResolvedValue({ sale_id: 1 });
            SaleRepository.update.mockResolvedValue({ sale_id: 1, updated: true });

            const result = await SaleService.updateSale(1, { total: 100 });
            expect(result.updated).toBe(true);
        });
    });

    describe('deleteSale', () => {
        it('deve deletar uma venda existente', async () => {
            SaleRepository.findById.mockResolvedValue({ sale_id: 1 });
            SaleRepository.delete.mockResolvedValue(true);

            const result = await SaleService.deleteSale(1);
            expect(result).toBe(true);
        });
    });

    describe('getSalesByCurrentUserId', () => {
        it('deve retornar vendas para um vendedor existente', async () => {
            Salesperson.findOne.mockResolvedValue({ seller_id: 1 });
            SaleRepository.findBySellerId.mockResolvedValue([{ sale_id: 1 }]);

            const result = await SaleService.getSalesByCurrentUserId(1);
            expect(result.length).toBe(1);
        });

        it('deve criar vendedor se usuário for admin', async () => {
            Salesperson.findOne.mockResolvedValue(null);
            UserModel.findByPk.mockResolvedValue({ user_id: 5, name: 'Admin', role: 'admin' });
            Salesperson.create.mockResolvedValue({ seller_id: 99 });
            SaleRepository.findBySellerId.mockResolvedValue([]);

            const result = await SaleService.getSalesByCurrentUserId(5);
            expect(result).toEqual([]);
        });

        it('deve lançar erro se usuário não for encontrado', async () => {
            Salesperson.findOne.mockResolvedValue(null);
            UserModel.findByPk.mockResolvedValue(null);
            await expect(SaleService.getSalesByCurrentUserId(999)).rejects.toThrow("Usuário não encontrado");
        });

        it('deve lançar erro se ID for inválido', async () => {
            await expect(SaleService.getSalesByCurrentUserId("abc")).rejects.toThrow("ID do usuário inválido");
        });
    });
});
