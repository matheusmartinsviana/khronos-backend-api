const express = require("express");
const router = express.Router();
const UserApi = require("../api/UserApi");
const authMiddleware = require("../middlewares/auth");

// Rotas do usuário autenticado
router.put("/", authMiddleware(), UserApi.updateUser);
router.get("/info", authMiddleware(), UserApi.getCurrentUserInfo);
router.delete("/", authMiddleware(), UserApi.deleteUser);

// Rotas específicas - devem vir antes das rotas com :id
router.get("/salesperson", authMiddleware(["admin"]), UserApi.getSalespersons);
router.get("/salesperson/:id", authMiddleware(["salesperson", "admin"]), UserApi.getSalespersonById);
router.post("/admin", authMiddleware(["admin"]), UserApi.createAdmin);
router.post("/salesperson", authMiddleware(["admin"]), UserApi.createSalesperson);

// Rotas administrativas genéricas
router.get("/", authMiddleware(["admin"]), UserApi.findUsers);
router.get("/:id", authMiddleware(["admin"]), UserApi.findUserById);
router.put("/:id", authMiddleware(["admin"]), UserApi.updateUser);
router.delete("/:id", authMiddleware(["admin"]), UserApi.deleteUser);
router.patch("/block/:id", authMiddleware(["admin"]), UserApi.blockUser);
router.patch("/unlock/:id", authMiddleware(["admin"]), UserApi.unlockUser);

module.exports = router;