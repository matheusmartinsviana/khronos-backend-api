// tests/user.test.js
const UserService = require("../../../services/UserService");
const UserModel = require("../../../models/UserModel");
const { hashPassword, comparePassword } = require("../../../utils/hash");
const { generateToken } = require("../../../utils/jwt");
const AppError = require("../../../errors/AppError");

jest.mock("../../../models/UserModel");
jest.mock("../../../utils/hash");
jest.mock("../../../utils/jwt");

describe("UserService - User Operations", () => {
  const validUser = {
    user_id: 1,
    name: "Test User",
    email: "test@example.com",
    password: "hashed_password",
    role: "viewer",
    save: jest.fn().mockResolvedValue(true),
    destroy: jest.fn().mockResolvedValue(true)
  };

  beforeEach(() => {
    jest.clearAllMocks();
    hashPassword.mockResolvedValue("hashed_password");
    comparePassword.mockResolvedValue(true);
    generateToken.mockReturnValue("mock_token");
  });

  describe("create", () => {
    it("should create a basic user", async () => {
      UserModel.create.mockResolvedValue(validUser);

      const result = await UserService.create(
        validUser.name,
        validUser.email,
        "password123",
        validUser.role
      );

      expect(result).toEqual({
        id: validUser.user_id,
        name: validUser.name,
        email: validUser.email,
        role: validUser.role,
        commission: null,
      });
      expect(hashPassword).toHaveBeenCalled();
      expect(UserModel.create).toHaveBeenCalled();
    });
  });

  describe("findUser", () => {
    it("should return a user by ID", async () => {
      UserModel.findByPk.mockResolvedValue(validUser);
      const result = await UserService.findUser(1);
      expect(result).toBe(validUser);
    });

    it("should throw if user not found", async () => {
      UserModel.findByPk.mockResolvedValue(null);
      await expect(UserService.findUser(99)).rejects.toThrow(AppError);
    });
  });

  describe("findUserByEmail", () => {
    it("should return user by email", async () => {
      UserModel.findOne.mockResolvedValue(validUser);
      const result = await UserService.findUserByEmail(validUser.email);
      expect(result).toBe(validUser);
    });

    it("should throw if user not found", async () => {
      UserModel.findOne.mockResolvedValue(null);
      await expect(UserService.findUserByEmail("none@x.com")).rejects.toThrow(AppError);
    });
  });

  describe("update", () => {
    it("should update user data", async () => {
      UserModel.findByPk.mockResolvedValue(validUser);
      const result = await UserService.update(1, "Updated", "new@mail.com", "newpass");
      expect(result).toBe(validUser);
      expect(validUser.name).toBe("Updated");
      expect(validUser.email).toBe("new@mail.com");
      expect(validUser.save).toHaveBeenCalled();
    });
  });

  describe("block", () => {
    it("should block user", async () => {
      UserModel.findByPk.mockResolvedValue(validUser);
      const result = await UserService.block(1);
      expect(result.role).toBe("blocked");
      expect(validUser.save).toHaveBeenCalled();
    });
  });

  describe("unlock", () => {
    it("should unlock user", async () => {
      validUser.role = "blocked";
      UserModel.findByPk.mockResolvedValue(validUser);
      const result = await UserService.unlock(1);
      expect(result.role).toBe("viewer");
      expect(validUser.save).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete user", async () => {
      UserModel.findByPk.mockResolvedValue(validUser);
      await UserService.delete(1);
      expect(validUser.destroy).toHaveBeenCalled();
    });
  });

  describe("find", () => {
    it("should return all users", async () => {
      const users = [validUser];
      UserModel.findAll.mockResolvedValue(users);
      const result = await UserService.find();
      expect(result).toBe(users);
    });
  });

  describe("login", () => {
    it("should login successfully", async () => {
      UserModel.findOne.mockResolvedValue(validUser);
      const result = await UserService.login(validUser.email, "password123");
      expect(result.token).toBe("mock_token");
    });

    it("should fail login if password invalid", async () => {
      comparePassword.mockResolvedValue(false);
      UserModel.findOne.mockResolvedValue(validUser);
      await expect(UserService.login(validUser.email, "wrongpass"))
        .rejects.toThrow(AppError);
    });
  });
});
