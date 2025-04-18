const express = require("express");
const router = express.Router();
const UserApi = require("../api/UserApi");
const authMiddleware = require("../middlewares/auth");

router.post("/register", UserApi.createUser);
router.post("/login", UserApi.login);

router.put("/", authMiddleware(), UserApi.updateUser);
router.get("/info", authMiddleware(), UserApi.getCurrentUserInfo);
router.delete("/", authMiddleware(), UserApi.deleteUser);

router.get("/", authMiddleware(["admin"]), UserApi.findUsers);
router.get("/:id", authMiddleware(["admin"]), UserApi.findUserById);
router.put("/:id", authMiddleware(["admin"]), UserApi.updateUser);
router.delete("/:id", authMiddleware(["admin"]), UserApi.deleteUser);
router.patch("/block/:id", authMiddleware(["admin"]), UserApi.blockUser);
router.patch("/unlock/:id", authMiddleware(["admin"]), UserApi.unlockUser);
router.post("/admin", authMiddleware(["admin"]), UserApi.createAdmin);

module.exports = router;