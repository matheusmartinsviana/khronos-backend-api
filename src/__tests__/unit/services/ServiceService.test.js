const ServiceService = require("../../../services/ServicesService");
const ServiceRepository = require("../../../repositories/ServiceRepository");
const AppError = require("../../../errors/AppError");

jest.mock("../../../repositories/ServiceRepository");

describe("ServiceService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("deve criar serviço com dados válidos", async () => {
            const serviceData = { name: "Serviço 1", price: 100, product_type: "tipo1" };
            ServiceRepository.create.mockResolvedValue(serviceData);

            const result = await ServiceService.create(serviceData);
            expect(result).toEqual(serviceData);
            expect(ServiceRepository.create).toHaveBeenCalledWith(serviceData);
        });

        it("deve lançar erro se nome estiver faltando", async () => {
            await expect(ServiceService.create({ price: 100, product_type: "tipo1" }))
                .rejects.toThrow("Name, price and product_type are required");
        });

        it("deve lançar erro se preço estiver undefined", async () => {
            await expect(ServiceService.create({ name: "Serviço", product_type: "tipo1" }))
                .rejects.toThrow("Name, price and product_type are required");
        });

        it("deve lançar erro se preço for null", async () => {
            await expect(ServiceService.create({ name: "Serviço", price: null, product_type: "tipo1" }))
                .rejects.toThrow("Name, price and product_type are required");
        });

        it("deve aceitar preço igual a zero", async () => {
            const serviceData = { name: "Serviço Zero", price: 0, product_type: "tipo1" };
            ServiceRepository.create.mockResolvedValue(serviceData);

            const result = await ServiceService.create(serviceData);
            expect(result).toEqual(serviceData);
            expect(ServiceRepository.create).toHaveBeenCalledWith(serviceData);
        });

        it("deve lançar erro se product_type estiver faltando", async () => {
            await expect(ServiceService.create({ name: "Serviço", price: 100 }))
                .rejects.toThrow("Name, price and product_type are required");
        });
    });
});
