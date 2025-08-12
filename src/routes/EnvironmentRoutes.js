const express = require("express");
const router = express.Router();
const EnvironmentController = require("../api/EnvironmentApi");
const authMiddleware = require("../middlewares/auth");

router.post("/", authMiddleware(), EnvironmentController.createEnvironment);
router.get("/", authMiddleware(), EnvironmentController.findEnvironments);
router.get("/:id", authMiddleware(), EnvironmentController.findEnvironmentById);
router.put("/:id", authMiddleware(), EnvironmentController.updateEnvironment);
router.delete("/:id", authMiddleware(), EnvironmentController.deleteEnvironment);


module.exports = router;
