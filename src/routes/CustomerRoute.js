const express = require("express");
const router = express.Router();
const CustomerApi = require("../api/CustomerApi");
const authMiddleware = require("../middlewares/auth");

router.post("/", authMiddleware(), CustomerApi.createCustomer);
router.get("/", authMiddleware(), CustomerApi.getAllCustomers);
router.get("/:id", authMiddleware(), CustomerApi.getCustomerById);
router.put("/:id", authMiddleware(), CustomerApi.updateCustomer);
router.delete("/:id", authMiddleware(), CustomerApi.deleteCustomer);

module.exports = router;
