const AppError = require("../errors/AppError");
const UserService = require("../services/UserService");

class UserController {
  async create(name, email, password, role) {
    if (!name || !email || !password) {
      throw new AppError("Name, email, and password are required.", 400);
    }
    return UserService.create(name, email, password, role);
  }

  async findUser(id) {
    if (!id) throw new AppError("Id is required", 400);
    return UserService.findUser(id);
  }

  async findUserByEmail(email) {
    if (!email) throw new AppError("Email is required", 400);
    return UserService.findUserByEmail(email);
  }

  async update(id, name, email, password) {
    if (!id || !name || !email || !password) {
      throw new AppError("Id, name, email, and password are required", 400);
    }
    return UserService.update(id, name, email, password);
  }

  async block(id) {
    if (!id) throw new AppError("Id is required", 400);
    return UserService.block(id);
  }

  async unlock(id) {
    if (!id) throw new AppError("Id is required", 400);
    return UserService.unlock(id);
  }

  async delete(id) {
    if (!id) throw new AppError("Id is required", 400);
    return UserService.delete(id);
  }

  async find() {
    return UserService.find();
  }

  async login(email, password) {
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }
    return UserService.login(email, password);
  }

  async findSalespersonById(id) {
    if (!id) throw new AppError("Id is required", 400);
    return UserService.findSalespersonById(id);
  }

  async findSalespersons() {
    return UserService.findSalespersons();
  }

}

module.exports = new UserController();