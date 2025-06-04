const express = require("express");
const router = express.Router();
const ServiceApi = require("../api/ServiceApi");
const authMiddleware = require("../middlewares/auth");

router.post("/", authMiddleware(), ServiceApi.createService);
router.get("/", authMiddleware(), ServiceApi.getAllServices);
router.get("/:id", authMiddleware(), ServiceApi.getServiceById);
router.put("/:id", authMiddleware(), ServiceApi.updateService);
router.delete("/:id", authMiddleware(), ServiceApi.deleteService);

module.exports = router;
