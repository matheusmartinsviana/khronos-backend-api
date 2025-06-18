const SaleService = require("../../../services/SaleService");

const Salesperson = require("../../../models/SalespersonModel");
const Customer = require("../../../models/CustomerModel");
const Product = require("../../../models/ProductModel");
const Service = require("../../../models/ServiceModel");
const SaleRepository = require("../../../repositories/SaleRepository");

jest.mock("../../../models/SalespersonModel");
jest.mock("../../../models/CustomerModel");
jest.mock("../../../models/ProductModel");
jest.mock("../../../models/ServiceModel");
jest.mock("../../../repositories/SaleRepository");

describe("SaleService.createSale", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve criar venda com sucesso com produtos válidos", async () => {
        const inputData = {
            seller_id: 1,
            customer_id: 2,
            products: [
                { product_id: 10, product_price: 50.0, quantity: 2 },
                { service_id: 20, product_price: 100.0, quantity: 1 }
            ],
            otherField: "some value"
        };

        Salesperson.findByPk.mockResolvedValue({ seller_id: 1 });
        Customer.findByPk.mockResolvedValue({ customer_id: 2 });

        Product.findAll.mockResolvedValue([{ product_id: 10 }]);
        Service.findAll.mockResolvedValue([{ service_id: 20 }]);

        SaleRepository.create.mockResolvedValue({ sale_id: 123, ...inputData });
        SaleRepository.createProductSales.mockResolvedValue();

        const result = await SaleService.createSale(inputData);

        expect(Salesperson.findByPk).toHaveBeenCalledWith(1);
        expect(Customer.findByPk).toHaveBeenCalledWith(2);
        expect(Product.findAll).toHaveBeenCalledWith({ where: { product_id: [10] } });
        expect(Service.findAll).toHaveBeenCalledWith({ where: { service_id: [20] } });

        expect(SaleRepository.create).toHaveBeenCalledWith(expect.objectContaining({
            seller_id: 1,
            customer_id: 2,
            otherField: "some value"
        }));

        expect(SaleRepository.createProductSales).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({ product_id: 10, sale_id: 123 }),
            expect.objectContaining({ service_id: 20, sale_id: 123 }),
        ]));

        expect(result.sale_id).toBe(123);
    });

    it("deve lançar erro quando vendedor não for encontrado", async () => {
        Salesperson.findByPk.mockResolvedValue(null);

        await expect(SaleService.createSale({
            seller_id: 999,
            customer_id: 1,
            products: []
        })).rejects.toThrow("Vendedor não encontrado");

        expect(Salesperson.findByPk).toHaveBeenCalledWith(999);
    });

    it("deve lançar erro quando cliente não for encontrado", async () => {
        Salesperson.findByPk.mockResolvedValue({ seller_id: 1 });
        Customer.findByPk.mockResolvedValue(null);

        await expect(SaleService.createSale({
            seller_id: 1,
            customer_id: 999,
            products: []
        })).rejects.toThrow("Cliente não encontrado");

        expect(Customer.findByPk).toHaveBeenCalledWith(999);
    });

    it("deve lançar erro quando produto inválido", async () => {
        Salesperson.findByPk.mockResolvedValue({ seller_id: 1 });
        Customer.findByPk.mockResolvedValue({ customer_id: 1 });

        Product.findAll.mockResolvedValue([{ product_id: 10 }]); // só encontrou produto 10
        Service.findAll.mockResolvedValue([]); // nenhum serviço encontrado

        await expect(SaleService.createSale({
            seller_id: 1,
            customer_id: 1,
            products: [
                { product_id: 10, product_price: 50, quantity: 1 },
                { product_id: 999, product_price: 100, quantity: 1 } // inválido
            ]
        })).rejects.toThrow("Um ou mais produtos/serviços são inválidos");
    });

    it("deve lançar erro quando serviço inválido", async () => {
        Salesperson.findByPk.mockResolvedValue({ seller_id: 1 });
        Customer.findByPk.mockResolvedValue({ customer_id: 1 });

        Product.findAll.mockResolvedValue([]);
        Service.findAll.mockResolvedValue([{ service_id: 20 }]); // só serviço 20 válido

        await expect(SaleService.createSale({
            seller_id: 1,
            customer_id: 1,
            products: [
                { service_id: 20, product_price: 100, quantity: 1 },
                { service_id: 999, product_price: 50, quantity: 1 } // inválido
            ]
        })).rejects.toThrow("Um ou mais produtos/serviços são inválidos");
    });
});
