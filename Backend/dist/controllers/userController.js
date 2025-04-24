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
exports.updateUserProfile = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const User_1 = __importDefault(require("../models/User"));
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return (0, responseHandler_1.response)(res, 400, "user with this id not found check the userId please");
        }
        const { name, email, phoneNumber } = req.body;
        const updatedUser = yield User_1.default.findByIdAndUpdate(userId, { name, email, phoneNumber }, { new: true, runValidators: true }).select("-password -verificationToken -restPasswordToken -resetPasswordExpires");
        ;
        if (!updatedUser) {
            return (0, responseHandler_1.response)(res, 404, "User Not Found");
        }
        return (0, responseHandler_1.response)(res, 200, "User Profile Update SuccessFully", updatedUser);
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Something went wrong", error);
    }
});
exports.updateUserProfile = updateUserProfile;
