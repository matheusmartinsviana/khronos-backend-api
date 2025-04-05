const jwt = require("jsonwebtoken");

const generateToken = (payload, secret, expiresIn = "1h") => {
    return jwt.sign(payload, secret, { expiresIn });
};

module.exports = {
    generateToken,
};