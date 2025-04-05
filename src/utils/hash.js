const bcrypt = require("bcrypt");

const hashPassword = async (password, saltRounds) => {
    return await bcrypt.hash(password, Number(saltRounds));
};

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePassword,
};