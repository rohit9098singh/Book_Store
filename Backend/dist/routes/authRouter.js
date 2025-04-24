"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const passport_1 = __importDefault(require("passport"));
const generateToken_1 = require("../utils/generateToken");
const router = (0, express_1.Router)();
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.post("/verify-email/:token", authController_1.verifyEmail);
router.post("/forgot-password", authController_1.forgotPassword);
router.post("/reset-password/:token", authController_1.resetPassword);
router.post("/logout", authController_1.logout);
router.get("/verify-auth", authMiddleware_1.authenticateUser, authController_1.checkUserAuth);
router.get("/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email"]
}));
//google callback route
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}`, session: false }), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const accessToken = yield generateToken_1.generateToken;
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.redirect(`${process.env.FRONTEND_URL}`);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
