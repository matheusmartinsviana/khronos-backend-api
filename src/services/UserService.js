require("dotenv").config();
const user = require("../models/UserModel");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");
const AppError = require("../errors/AppError");

class UserService {
    async create(name, email, password, role) {
        if (!name || !email || !password) {
            throw new AppError("Name, email, and password are required.", 400);
        }

        const hashed = await hashPassword(password, process.env.SALT_VALUE);

        try {
            return await user.create({ name, email, password: hashed, role });
        } catch (error) {
            if (error.parent?.code === "23505") {
                throw new AppError("This email is already registered.", 409);
            }
            if (error.errors?.[0]?.validatorKey === "isEmail") {
                throw new AppError("The provided email is not valid.", 400);
            }
            throw new AppError("An error occurred while creating the user. Please try again.");
        }
    }

    async findUser(id) {
        if (!id) throw new AppError("Id is required", 400);

        const found = await user.findByPk(id);
        if (!found) throw new AppError("User not found", 404);

        return found;
    }

    async findUserByEmail(email) {
        if (!email) throw new AppError("Email is required", 400);

        const found = await user.findOne({ where: { email } });
        if (!found) throw new AppError("User not found", 404);

        return found;
    }

    async update(id, name, email, password) {
        if (!id || !name || !email || !password) {
            throw new AppError("Id, name, email, and password are required", 400);
        }

        const userValue = await this.findUser(id);
        const hashed = await hashPassword(password, process.env.SALT_VALUE);

        userValue.name = name;
        userValue.email = email;
        userValue.password = hashed;
        await userValue.save();

        return userValue;
    }

    async block(id) {
        if (!id) throw new AppError("Id is required", 400);

        const userValue = await this.findUser(id);
        userValue.role = "blocked";
        await userValue.save();

        return userValue;
    }

    async unlock(id) {
        if (!id) throw new AppError("Id is required", 400);

        const userValue = await this.findUser(id);
        userValue.role = "viewer";
        await userValue.save();

        return userValue;
    }

    async delete(id) {
        if (!id) throw new AppError("Id is required", 400);

        const userValue = await this.findUser(id);
        await userValue.destroy();
    }

    async find() {
        return user.findAll();
    }

    async login(email, password) {
        if (!email || !password) throw new AppError("Email and password are required", 400);
        const userValue = await this.findUserByEmail(email);
        const validPassword = await comparePassword(password, userValue.password);

        if (!validPassword) throw new AppError("Invalid email or password", 401);

        const token = generateToken(
            { id: userValue.user_id, role: userValue.role },
            process.env.SECRET_KEY
        );

        return {
            id: userValue.user_id,
            name: userValue.name,
            email: userValue.email,
            role: userValue.role,
            token,
        };
    }
}

module.exports = new UserService();