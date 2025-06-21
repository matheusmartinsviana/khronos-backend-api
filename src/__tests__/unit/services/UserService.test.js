const AppError = require("../../../errors/AppError");
const UserService = require("../../../services/UserService");
const UserModel = require("../../../models/UserModel");
const SalespersonModel = require("../../../models/SalespersonModel");
const SalespersonRepository = require("../../../repositories/SalespersonRepository");
const { hashPassword, comparePassword } = require("../../../utils/hash");
const { generateToken } = require("../../../utils/jwt");

jest.mock("../../../models/UserModel");
jest.mock("../../../models/SalespersonModel");
jest.mock("../../../repositories/SalespersonRepository");
jest.mock("../../../utils/hash");
jest.mock("../../../utils/jwt");

describe("UserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("deve criar um usuário do tipo 'viewer'", async () => {
      const mockUser = { user_id: 1, name: "João", email: "joao@email.com", role: "viewer" };
      hashPassword.mockResolvedValue("hashedpass");
      UserModel.create.mockResolvedValue(mockUser);

      const result = await UserService.create("João", "joao@email.com", "123", "viewer");

      expect(hashPassword).toHaveBeenCalled();
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toMatchObject({
        id: 1,
        name: "João",
        email: "joao@email.com",
        role: "viewer",
        commission: null
      });
    });

    it("deve lançar erro se e-mail já estiver registrado", async () => {
      const error = { parent: { code: "23505" } };
      hashPassword.mockResolvedValue("hashed");
      UserModel.create.mockRejectedValue(error);

      await expect(UserService.create("Ana", "ana@email.com", "123", "viewer"))
        .rejects.toThrow("This email is already registered.");
    });
  });

  describe("findUserByEmail", () => {
    it("deve retornar usuário por email", async () => {
      const mockUser = { user_id: 1, email: "a@a.com" };
      UserModel.findOne.mockResolvedValue(mockUser);

      const result = await UserService.findUserByEmail("a@a.com");

      expect(UserModel.findOne).toHaveBeenCalledWith({ where: { email: "a@a.com" } });
      expect(result).toEqual(mockUser);
    });

    it("deve lançar erro se email não for fornecido", async () => {
      await expect(UserService.findUserByEmail()).rejects.toThrow("Email is required");
    });

    it("deve lançar erro se usuário não for encontrado", async () => {
      UserModel.findOne.mockResolvedValue(null);
      await expect(UserService.findUserByEmail("nao@existe.com")).rejects.toThrow("User not found");
    });
  });

  describe("update", () => {
    it("deve atualizar dados do usuário", async () => {
      const mockUser = { save: jest.fn(), name: "", email: "", password: "" };
      jest.spyOn(UserService, "findUser").mockResolvedValue(mockUser);
      hashPassword.mockResolvedValue("newHashed");

      const result = await UserService.update(1, "Novo", "novo@email.com", "senha123");

      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toBe(mockUser);
    });

    it("deve lançar erro se faltar campos", async () => {
      await expect(UserService.update(1, "", "", "")).rejects.toThrow("Id, name, email, and password are required");
    });
  });

  describe("block", () => {
    it("deve bloquear usuário", async () => {
      const mockUser = { save: jest.fn(), role: "" };
      jest.spyOn(UserService, "findUser").mockResolvedValue(mockUser);

      const result = await UserService.block(1);

      expect(mockUser.role).toBe("blocked");
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toBe(mockUser);
    });
  });

  describe("unlock", () => {
    it("deve desbloquear usuário", async () => {
      const mockUser = { save: jest.fn(), role: "" };
      jest.spyOn(UserService, "findUser").mockResolvedValue(mockUser);

      const result = await UserService.unlock(1);

      expect(mockUser.role).toBe("viewer");
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toBe(mockUser);
    });
  });

  describe("delete", () => {
    it("deve deletar o usuário", async () => {
      const mockUser = { destroy: jest.fn() };
      jest.spyOn(UserService, "findUser").mockResolvedValue(mockUser);

      await UserService.delete(1);
      expect(mockUser.destroy).toHaveBeenCalled();
    });
  });

  describe("find", () => {
    it("deve retornar todos os usuários", async () => {
      const users = [{}, {}];
      UserModel.findAll.mockResolvedValue(users);

      const result = await UserService.find();

      expect(result).toBe(users);
    });
  });

  describe("login", () => {
    it("deve retornar dados e token se login for válido", async () => {
      const mockUser = {
        user_id: 1,
        name: "João",
        email: "joao@email.com",
        role: "admin",
        password: "hashed"
      };

      jest.spyOn(UserService, "findUserByEmail").mockResolvedValue(mockUser);
      comparePassword.mockResolvedValue(true);
      generateToken.mockReturnValue("tokentest");

      const result = await UserService.login("joao@email.com", "123");

      expect(result.token).toBe("tokentest");
      expect(result.name).toBe("João");
    });

    it("deve lançar erro se senha for inválida", async () => {
      const mockUser = { password: "hashed" };
      jest.spyOn(UserService, "findUserByEmail").mockResolvedValue(mockUser);
      comparePassword.mockResolvedValue(false);

      await expect(UserService.login("email", "senha")).rejects.toThrow("Invalid email or password");
    });
  });

  describe("findSalespersonById", () => {
    it("deve retornar vendedor se existir", async () => {
      const mockSales = { user_id: 1, commission: 0.1 };
      SalespersonModel.findOne.mockResolvedValue(mockSales);

      const result = await UserService.findSalespersonById(1);

      expect(result).toBe(mockSales);
    });

    it("deve lançar erro se não encontrar vendedor", async () => {
      SalespersonModel.findOne.mockResolvedValue(null);

      await expect(UserService.findSalespersonById(1)).rejects.toThrow("Salesperson not found");
    });
  });

  describe("findSalespersons", () => {
    it("deve retornar lista de vendedores", async () => {
      const mockList = [{}, {}];
      SalespersonRepository.findAll.mockResolvedValue(mockList);

      const result = await UserService.findSalespersons();
      expect(result).toBe(mockList);
    });
  });

  describe("updateUserInfo", () => {
    it("deve atualizar nome, email, role e comissão", async () => {
      const mockUser = { save: jest.fn(), name: "", email: "", role: "" };
      const mockSales = { commission: 0.05, save: jest.fn() };
      jest.spyOn(UserService, "findUser").mockResolvedValue(mockUser);
      SalespersonModel.findOne.mockResolvedValue(mockSales);

      const result = await UserService.updateUserInfo(1, "Ana", "ana@email.com", "salesperson", 0.1);

      expect(mockUser.name).toBe("Ana");
      expect(mockSales.commission).toBe(0.1);
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockSales.save).toHaveBeenCalled();
      expect(result).toBe(mockUser);
    });

    it("deve lançar erro se não encontrar salesperson", async () => {
      const mockUser = { save: jest.fn(), name: "", email: "", role: "" };
      jest.spyOn(UserService, "findUser").mockResolvedValue(mockUser);
      SalespersonModel.findOne.mockResolvedValue(null);

      await expect(UserService.updateUserInfo(1, "Ana", "ana@email.com", "salesperson", 0.1))
        .rejects.toThrow("Salesperson not found");
    });
  });
});
