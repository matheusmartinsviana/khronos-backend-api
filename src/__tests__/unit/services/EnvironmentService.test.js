const environment = require("../../../models/EnvironmentModel");
const AppError = require("../../../errors/AppError");
const EnvironmentService = require("../../../services/EnvironmentService");

jest.mock("../../../models/EnvironmentModel");

describe("EnvironmentService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("deve criar um novo ambiente com sucesso", async () => {
            const mockEnv = { id: 1, name: "Prod", description: "Production" };
            environment.create.mockResolvedValue(mockEnv);

            const result = await EnvironmentService.create("Prod", "Production");

            expect(environment.create).toHaveBeenCalledWith({
                name: "Prod",
                description: "Production",
            });
            expect(result).toEqual(mockEnv);
        });

        it("deve lançar erro se o create falhar", async () => {
            environment.create.mockRejectedValue(new Error("DB error"));

            await expect(
                EnvironmentService.create("Prod", "Production")
            ).rejects.toThrow(AppError);
        });
    });

    describe("findEnvironment", () => {
        it("deve retornar ambiente por ID", async () => {
            const mockEnv = { id: 1 };
            environment.findByPk.mockResolvedValue(mockEnv);

            const result = await EnvironmentService.findEnvironment(1);

            expect(environment.findByPk).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockEnv);
        });

        it("deve lançar erro se ID não for fornecido", async () => {
            await expect(EnvironmentService.findEnvironment()).rejects.toThrow(
                AppError
            );
        });
    });

    describe("update", () => {
        it("deve atualizar ambiente com sucesso", async () => {
            const mockEnv = {
                id: 1,
                name: "Old",
                description: "Old Desc",
                save: jest.fn(),
            };
            jest.spyOn(EnvironmentService, "findEnvironment").mockResolvedValue(mockEnv);

            const result = await EnvironmentService.update(1, "New", "New Desc");

            expect(mockEnv.name).toBe("New");
            expect(mockEnv.description).toBe("New Desc");
            expect(mockEnv.save).toHaveBeenCalled();
            expect(result).toEqual(mockEnv);
        });

        it("deve lançar erro se faltar parâmetros", async () => {
            await expect(EnvironmentService.update(1)).rejects.toThrow(AppError);
        });
    });

    describe("delete", () => {
        it("deve deletar ambiente", async () => {
            const mockEnv = { destroy: jest.fn() };
            jest.spyOn(EnvironmentService, "findEnvironment").mockResolvedValue(mockEnv);

            await EnvironmentService.delete(1);

            expect(mockEnv.destroy).toHaveBeenCalled();
        });

        it("deve lançar erro se ID não for passado", async () => {
            await expect(EnvironmentService.delete()).rejects.toThrow(AppError);
        });
    });

    describe("find", () => {
        it("deve retornar todos ambientes", async () => {
            const mockList = [{ id: 1 }];
            environment.findAll.mockResolvedValue(mockList);

            const result = await EnvironmentService.find();

            expect(environment.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockList);
        });
    });

    describe("bulkCreate", () => {
        it("deve criar múltiplos ambientes", async () => {
            const envs = [{ name: "Prod" }];
            environment.bulkCreate.mockResolvedValue(envs);

            const result = await EnvironmentService.bulkCreate(envs);

            expect(environment.bulkCreate).toHaveBeenCalledWith(envs);
            expect(result).toEqual(envs);
        });

        it("deve lançar erro se lista for inválida", async () => {
            await expect(EnvironmentService.bulkCreate(null)).rejects.toThrow(AppError);
        });
    });
});
