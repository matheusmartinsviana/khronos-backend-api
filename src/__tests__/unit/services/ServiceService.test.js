const ServiceService = require("../../../services/ServicesService");
const ServiceRepository = require("../../../repositories/ServiceRepository");
const AppError = require("../../../errors/AppError");

jest.mock("../../../repositories/ServiceRepository");

describe("ServiceService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("deve criar um serviço com dados válidos", async () => {
            const data = { name: "Serviço 1", price: 100, product_type: "tipoA" };
            ServiceRepository.create.mockResolvedValue({ id: 1, ...data });

            const result = await ServiceService.create(data);

            expect(ServiceRepository.create).toHaveBeenCalledWith(data);
            expect(result).toEqual(expect.objectContaining(data));
        });

        it("deve lançar erro se dados obrigatórios estiverem ausentes", async () => {
            await expect(ServiceService.create({})).rejects.toThrow(AppError);
            await expect(ServiceService.create({ name: "Test" })).rejects.toThrow(AppError);
            await expect(ServiceService.create({ name: "Test", price: null })).rejects.toThrow(AppError);
            await expect(ServiceService.create({ name: "Test", price: 100 })).rejects.toThrow(AppError);
        });
    });

    describe("findById", () => {
        it("deve retornar o serviço pelo id", async () => {
            const service = { id: 1, name: "Serviço 1", price: 100, product_type: "tipoA" };
            ServiceRepository.findById.mockResolvedValue(service);

            const result = await ServiceService.findById(1);

            expect(ServiceRepository.findById).toHaveBeenCalledWith(1);
            expect(result).toEqual(service);
        });

        it("deve lançar erro se id não for fornecido", async () => {
            await expect(ServiceService.findById()).rejects.toThrow("Id is required");
        });

        it("deve lançar erro se serviço não for encontrado", async () => {
            ServiceRepository.findById.mockResolvedValue(null);

            await expect(ServiceService.findById(999)).rejects.toThrow("Service not found");
        });
    });

    describe("findAll", () => {
        it("deve retornar lista de serviços", async () => {
            const services = [
                { id: 1, name: "Serviço 1", price: 100, product_type: "tipoA" },
                { id: 2, name: "Serviço 2", price: 200, product_type: "tipoB" },
            ];
            ServiceRepository.findAll.mockResolvedValue(services);

            const result = await ServiceService.findAll();

            expect(ServiceRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(services);
        });
    });

    describe("update", () => {
        it("deve atualizar serviço com dados válidos", async () => {
            const id = 1;
            const data = { name: "Serviço atualizado", price: 150, product_type: "tipoC" };
            ServiceRepository.update.mockResolvedValue([1]); // indica que 1 registro foi atualizado
            ServiceRepository.findById.mockResolvedValue({ id, ...data });

            const result = await ServiceService.update(id, data);

            expect(ServiceRepository.update).toHaveBeenCalledWith(id, data);
            expect(ServiceRepository.findById).toHaveBeenCalledWith(id);
            expect(result).toEqual(expect.objectContaining(data));
        });

        it("deve lançar erro se parâmetros estiverem ausentes", async () => {
            await expect(ServiceService.update()).rejects.toThrow(AppError);
            await expect(ServiceService.update(1, {})).rejects.toThrow(AppError);
            await expect(ServiceService.update(1, { name: "Name" })).rejects.toThrow(AppError);
            await expect(ServiceService.update(1, { name: "Name", price: 100 })).rejects.toThrow(AppError);
        });

        it("deve lançar erro se update não afetar nenhum registro", async () => {
            ServiceRepository.update.mockResolvedValue([0]);

            await expect(ServiceService.update(1, { name: "Name", price: 100, product_type: "tipoA" }))
                .rejects.toThrow("Service not found or not updated");
        });
    });

    describe("delete", () => {
        it("deve deletar serviço com sucesso", async () => {
            ServiceRepository.delete.mockResolvedValue(true);

            await expect(ServiceService.delete(1)).resolves.toBeUndefined();
            expect(ServiceRepository.delete).toHaveBeenCalledWith(1);
        });

        it("deve lançar erro se id não for informado", async () => {
            await expect(ServiceService.delete()).rejects.toThrow("Id is required");
        });

        it("deve lançar erro se delete falhar", async () => {
            ServiceRepository.delete.mockResolvedValue(false);

            await expect(ServiceService.delete(1)).rejects.toThrow("Service not found or not deleted");
        });
    });
});
