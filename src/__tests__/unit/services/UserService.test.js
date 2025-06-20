const AppError = require("../../../errors/AppError");
const UserModel = require("../../../models/UserModel");
const UserService = require("../../../services/UserService");

jest.mock("../../../models/UserModel"); // mock do model User

describe('UserService - findUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o usuário quando um ID válido for fornecido', async () => {
    const mockUser = { user_id: 1, name: 'Matheus' };
    UserModel.findByPk.mockResolvedValue(mockUser);

    const result = await UserService.findUser(1);

    expect(UserModel.findByPk).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockUser);
  });

  it('deve lançar erro se nenhum ID for fornecido', async () => {
    await expect(UserService.findUser()).rejects.toThrow(AppError);
    await expect(UserService.findUser()).rejects.toThrow('Id is required');
  });

  it('deve lançar erro se o usuário não for encontrado', async () => {
    UserModel.findByPk.mockResolvedValue(null);

    await expect(UserService.findUser(123)).rejects.toThrow(AppError);
    await expect(UserService.findUser(123)).rejects.toThrow('User not found');
  });
});
