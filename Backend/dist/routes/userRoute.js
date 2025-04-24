"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.put("/profile/update/:userId", authMiddleware_1.authenticateUser, userController_1.updateUserProfile); // put update karne ke liye isliye use kiye hai patch nhi use kiye hai kyuke patch me hame strictly sare column update karna zaruri hai but put me jo required sirf usko kar sakte hai hm
exports.default = router;
