require("dotenv").config();
// const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
const user = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../Errors/AppError");

// const mailerSend = new MailerSend({
//   apiKey: process.env.API_KEY,
// });

// const sentFrom = new Sender(
//   "MS_fmz61H@trial-351ndgwemo5gzqx8.mlsender.net",
//   "Chuck Norris API"
// );

class UserController {
  async create(name, email, password, role) {
    if (!name || !email || !password) {
      throw new AppError("Name, email, and password are required.", 400);
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_VALUE)
    );

    try {
      return await user.create({ name, email, password: hashedPassword, role });
    } catch (error) {
      if (error.parent?.code === "23505") {
        throw new AppError("This email is already registered.", 409);
      }
      if (error.errors?.[0]?.validatorKey === "isEmail") {
        throw new AppError("The provided email is not valid.", 400);
      }
      throw new AppError(
        "An error occurred while creating the user. Please try again.",
        500
      );
    }
  }

  async createAccessCode(email, code) {
    if (!code || !email) throw new AppError("Code and email are required", 400);

    const expirationTime = new Date(Date.now() + 5 * 60 * 1000);
    const [updated] = await user.update(
      { accessCode: code, accessCodeExpiration: expirationTime },
      { where: { email } }
    );

    if (updated === 0) throw new AppError("User not found", 404);
    return { success: true, message: "Access code created successfully" };
  }

  async findUser(id) {
    if (!id) throw new AppError("Id is required", 400);

    const userValue = await user.findByPk(id);
    if (!userValue) throw new AppError("User not found", 404);
    return userValue;
  }

  async findUserByEmail(email) {
    if (!email) throw new AppError("Email is required", 400);

    const userValue = await user.findOne({ where: { email } });
    if (!userValue) throw new AppError("User not found", 404);

    return userValue;
  }

  async update(id, name, email, password) {
    if (!id || !name || !email || !password) {
      throw new AppError("Id, name, email, and password are required", 400);
    }

    const userValue = await this.findUser(id);
    if (!userValue) throw new AppError("Internal server error.", 500);

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_VALUE)
    );
    userValue.name = name;
    userValue.email = email;
    userValue.password = hashedPassword;
    await userValue.save();

    return userValue;
  }

  async block(id) {
    if (!id) throw new AppError("Id is required", 400);

    const userValue = await this.findUser(id);
    if (!userValue) throw new AppError("User not found", 404);

    userValue.role = "blocked";
    await userValue.save();

    return userValue;
  }

  async unlock(id) {
    if (!id) throw new AppError("Id is required", 400);

    const userValue = await this.findUser(id);
    if (!userValue) throw new AppError("User not found", 404);

    userValue.role = "viewer";
    await userValue.save();

    return userValue;
  }

  async delete(id) {
    if (!id) throw new AppError("Id is required", 400);

    const userValue = await this.findUser(id);
    if (!userValue) throw new AppError("User not found", 404);

    await userValue.destroy();
  }

  async deleteJokesByUserId(userId) {
    await user.destroy({ where: { id: userId } });
  }

  async find() {
    return user.findAll();
  }

  // async verifyAccessCode(email, code) {
  async verifyAccessCode(email) {
    // if (!email || !code) throw new AppError("Email and code are required", 400);
    if (!email) throw new AppError("Email is required", 400);

    const userValue = await user.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!userValue) {
      throw new AppError("Invalid email.", 401);
    }

    // if (new Date() > userValue.accessCodeExpiration) {
    //   throw new AppError("Invalid or expired access code", 401);
    // }

    await user.update(
      // { accessCode: null, accessCodeExpiration: null },
      { where: { email: email.toLowerCase() } }
    );

    return jwt.sign(
      { id: userValue.id, role: userValue.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
  }

  async login(email, password) {
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const userValue = await this.findUserByEmail(email);
    const validPassword = await bcrypt.compare(password, userValue.password);
    if (!validPassword) throw new AppError("Invalid email or password", 401);
    console.log("userValue", userValue);

    const token = jwt.sign(
      { id: userValue.user_id, role: userValue.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    return {
      id: userValue.user_id,
      name: userValue.name,
      email: userValue.email,
      role: userValue.role,
      token,
    };

    // const accessCode = Math.floor(100000 + Math.random() * 900000);
    // await this.createAccessCode(email, accessCode);

    // const recipients = [new Recipient(email, userValue.name)];
    // const emailParams = new EmailParams()
    //   .setFrom(sentFrom)
    //   .setTo(recipients)
    //   .setReplyTo(sentFrom)
    //   .setSubject(`Your access code: ${accessCode}`)
    //   .setHtml(
    //     `<p>Congratulations! You have been selected for a mission approved by Chuck Norris: verify this code to gain access. Your access code is: <strong>${accessCode}</strong></p>`
    //   )
    //   .setText(
    //     `Congratulations! You have been selected for a mission approved by Chuck Norris: verify this code to gain access. Your access code is: ${accessCode}`
    //   );

    // try {
    //   await mailerSend.email.send(emailParams);
    //   return { message: "Access code sent to your email" };
    // } catch (error) {
    //   console.error(
    //     "Error sending email:",
    //     error.response ? error.response.body : error
    //   );
    //   throw new AppError("Failed to send access code", 500);
    // }
  }
}

module.exports = new UserController();