const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const UserApi = require("../api/UserApi");
const AuthController = require("../controllers/AuthController");

router.post("/login", UserApi.login);
router.post("/register", UserApi.createUser);
router.get("/validate-token", authMiddleware(), AuthController.validateToken);

module.exports = router;
