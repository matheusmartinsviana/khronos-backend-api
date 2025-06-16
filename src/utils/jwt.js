const jwt = require("jsonwebtoken");

const generateToken = (payload, secret, expiresIn = "2h") => {
    return jwt.sign(payload, secret, { expiresIn });
};

module.exports = {
    generateToken,
};