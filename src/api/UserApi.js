const UserController = require("../controllers/UserController");

class UserApi {
  async createUser(req, res) {
    const { name, email, password } = req.body;
    const role = "viewer";
    try {
      const user = await UserController.create(name, email, password, role);
      return res.status(201).send(user);
    } catch (e) {
      return res.send({ error: e.message });
    }
  }

  async createAdmin(req, res) {
    const { name, email, password } = req.body;
    const role = "admin";
    try {
      const user = await UserController.create(name, email, password, role);
      return res.status(201).send(user);
    } catch (e) {
      return res.status(400).send({ error: e.message });
    }
  }

  async updateUser(req, res) {
    const id = req.params.id || req.user.id;
    const { name, email, password } = req.body;

    try {
      const user = await UserController.update(id, name, email, password);
      return res.status(200).send(user);
    } catch (e) {
      return res
        .status(400)
        .send({ error: `Error updating user: ${e.message}` });
    }
  }

  async updateUserInfo(req, res) {
    const id = req.params.id || req.user.id;
    const { name, email, role, commission } = req.body;

    try {
      const user = await UserController.updateUserInfo(id, name, email, role, commission || null);
      return res.status(200).send(user);
    } catch (e) {
      return res
        .status(400)
        .send({ error: `Error updating user info: ${e.message}` });
    }
  }

  async deleteUser(req, res) {
    try {
      const id = req.params.id || req.user.user_id;

      await UserController.delete(Number(id));
      return res.status(204).send();
    } catch (e) {
      return res
        .status(400)
        .send({ error: `Error deleting user: ${e.message}` });
    }
  }

  async blockUser(req, res) {
    try {
      const { id } = req.params;

      await UserController.block(Number(id));
      return res.status(204).send();
    } catch (e) {
      return res
        .status(400)
        .send({ error: `Error to block user: ${e.message}` });
    }
  }
  async unlockUser(req, res) {
    try {
      const { id } = req.params;

      await UserController.unlock(Number(id));
      return res.status(200).send();
    } catch (e) {
      return res
        .status(400)
        .send({ error: `Error to unlock user: ${e.message}` });
    }
  }

  async findUsers(req, res) {
    try {
      const users = await UserController.find();
      return res.status(200).send(users);
    } catch (e) {
      return res
        .status(400)
        .send({ error: `Error listing users: ${e.message}` });
    }
  }

  async getCurrentUserInfo(req, res) {
    const id = req.user.user_id;

    try {
      if (!id) {
        return res.status(400).send({ error: "Error to get user_id from payload" });
      }
      const user = await UserController.findUser(id);
      return res.status(200).send(user);
    } catch (e) {
      return res.status(400).send({ error: `Error to get user: ${e.message}` });
    }
  }

  async findUserById(req, res) {
    const { id } = req.params;

    try {
      if (!id) {
        return res.status(400).send({ error: "Id is required" });
      }
      const user = await UserController.findUser(id);
      return res.status(200).send(user);
    } catch (e) {
      return res.status(400).send({ error: `Error to get user: ${e.message}` });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const response = await UserController.login(email, password);
      return res.status(200).send(response);
    } catch (e) {
      return res.status(400).send({ error: `Error logging: ${e.message}` });
    }
  }

  async createSalesperson(req, res) {
    const { name, email, password, commission } = req.body;
    const role = "salesperson";
    try {
      const user = await UserController.create(name, email, password, role, commission);
      return res.status(201).send(user);
    } catch (e) {
      return res.status(400).send({ error: e.message });
    }
  }
  async getSalespersonById(req, res) {
    const { id } = req.params;

    try {
      if (!id) {
        return res.status(400).send({ error: "Id is required" });
      }
      const user = await UserController.findSalespersonById(id);
      return res.status(200).send(user);
    } catch (e) {
      return res.status(400).send({ error: `Error to get user: ${e.message}` });
    }
  }
  async getSalespersons(req, res) {
    try {
      const users = await UserController.findSalespersons();
      return res.status(200).send(users);
    } catch (e) {
      return res.status(400).send({ error: `Error listing users: ${e.message}` });
    }
  }

}

module.exports = new UserApi();