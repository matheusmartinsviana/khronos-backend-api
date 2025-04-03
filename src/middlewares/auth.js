const jwt = require("jsonwebtoken");
const user = require("../controllers/UserController");
require("dotenv").config();

function authMiddleware(roles = []) {
  return async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).send({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({ error: "Token not provided." });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      console.log("Decoded token:", decoded);

      if (!decoded) {
        return res.status(401).send({ error: "Decoded was not found." });
      }

      const userLogged = await user.findUser(decoded.id);
      if (!userLogged) {
        return res.status(404).json("User not found.");
      }

      if (roles.length && !roles.includes(userLogged.role)) {
        return res.status(403).json("User without permission.");
      }

      if (userLogged.role === "blocked") {
        return res.status(403).json("User blocked.");
      }

      req.user = userLogged;
      next();
    } catch (err) {
      return res.status(401).send({ error: "Invalid token.", details: err.message });
    }
  };
}

module.exports = authMiddleware;