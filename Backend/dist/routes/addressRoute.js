"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const addressController_1 = require("../controllers/addressController");
const router = (0, express_1.Router)();
router.post("/create-or-update-address-by-userId", authMiddleware_1.authenticateUser, addressController_1.createOrUpdateAddressByUserId);
router.get("/get-address-by-userId", authMiddleware_1.authenticateUser, addressController_1.getAddressByUserId);
exports.default = router;
