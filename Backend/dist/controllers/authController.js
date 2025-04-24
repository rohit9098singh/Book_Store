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
exports.checkUserAuth = exports.logout = exports.resetPassword = exports.forgotPassword = exports.login = exports.verifyEmail = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const responseHandler_1 = require("../utils/responseHandler");
const crypto_1 = __importDefault(require("crypto"));
const emailConfig_1 = require("../config/emailConfig");
const generateToken_1 = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, agreeTerms } = req.body;
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return (0, responseHandler_1.response)(res, 400, "User Already Exists");
        }
        const hashedPassword = yield bcrypt.hash(password, 10);
        const verificationToken = crypto_1.default.randomBytes(20).toString("hex");
        const newUser = new User_1.default({
            name,
            email,
            password: hashedPassword,
            agreeTerms,
            verificationToken,
        });
        yield newUser.save();
        const result = yield (0, emailConfig_1.sendVerificationToEmail)(newUser.email, verificationToken);
        console.log("Verification email result:", result);
        return (0, responseHandler_1.response)(res, 200, "User Registered Successfully. Please check your email to verify your account.", {
            email: newUser.email,
            name: newUser.name,
        });
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error", error.message);
    }
});
exports.register = register;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const user = yield User_1.default.findOne({ verificationToken: token });
        if (!user) {
            return (0, responseHandler_1.response)(res, 400, "invalid or expired verification token");
        }
        if (user.isVerified) {
            return (0, responseHandler_1.response)(res, 400, "Email is already verified");
        }
        user.isVerified = true;
        user.verificationToken = undefined; // so it can’t be reused
        const accessToken = (0, generateToken_1.generateToken)(user);
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        yield user.save();
        return (0, responseHandler_1.response)(res, 200, "Email verified successfully");
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error", error.message);
    }
});
exports.verifyEmail = verifyEmail;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return (0, responseHandler_1.response)(res, 400, "Invalid email or password");
        }
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            return (0, responseHandler_1.response)(res, 400, "Invalid email or password");
        }
        if (!user.isVerified) {
            return (0, responseHandler_1.response)(res, 400, "Please verify your email before login");
        }
        const accessToken = (0, generateToken_1.generateToken)(user);
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        return (0, responseHandler_1.response)(res, 200, "User logged in successfully", {
            user: user.name,
            email: user.email,
            verificationToken: user.verificationToken
        });
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error", error.message);
    }
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return (0, responseHandler_1.response)(res, 400, "No account found with this email");
        }
        const resetPasswordToken = crypto_1.default.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        user.save();
        yield (0, emailConfig_1.sendResetPasswordLinkToEmail)(user.email, resetPasswordToken);
        return (0, responseHandler_1.response)(res, 200, "A password reset link has been send to your email address");
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error", error.message);
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password: newpassword } = req.body; // new password he name hai
        const user = yield User_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return (0, responseHandler_1.response)(res, 400, "invalid or expired reset password token");
        }
        const hashedPassword = yield bcrypt.hash(newpassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        yield user.save();
        return (0, responseHandler_1.response)(res, 200, "your password has been reset successfully now you can login with your new password");
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error", error.message);
    }
});
exports.resetPassword = resetPassword;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.cookies["access_token"]) {
            return (0, responseHandler_1.response)(res, 400, "No active session found");
        }
        res.clearCookie("access_token", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        res.cookie("auth_token", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return (0, responseHandler_1.response)(res, 200, "Successfully Logged out");
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Internal server error", error.message);
    }
});
exports.logout = logout;
const checkUserAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req === null || req === void 0 ? void 0 : req.id;
        if (!userId) {
            return (0, responseHandler_1.response)(res, 400, "Unauthorized, please login to access our page");
        }
        const user = yield User_1.default.findById(userId).select("-password -verificationToken -resetPasswordExpires -restPasswordToken ");
        if (!user) {
            return (0, responseHandler_1.response)(res, 403, "User not found");
        }
        return (0, responseHandler_1.response)(res, 200, "User retrieved successfully", user);
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Internal server error", error.message);
    }
});
exports.checkUserAuth = checkUserAuth;
{
    /**
     *   ============= Rest password Ka Token Timing ka Check Kaise lag raha hai=========================
     *
     *    1)Maan lo token expire hone ka time     =>hai:resetPasswordExpires = 2:00 PM
     *
     *    2)Abhi ka time hai:Date.now() = 1:45 PM
     *
     *    3) Check kya hoga?  2:00 PM > 1:45 PM sahi hai(Token abhi bhi valid hai.)
     *
     *
     *  ===================== Dusra example:============
     *   1) resetPasswordExpires = 1:30 PM
     *   2)  Date.now() = 1:45 PM
     *   3)1:30 PM > 1:45 PM   galt hai (Token expire ho gaya.)
     *
     *
     */
}
