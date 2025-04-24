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
exports.sendResetPasswordLinkToEmail = exports.sendVerificationToEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
transporter.verify((error, success) => {
    if (error) {
        console.log(" Gmail services are not ready to send emails. Please check the email configuration.");
    }
    else {
        console.log("✅ Gmail services are ready to send emails.");
    }
});
const sendEmail = (to, subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transporter.sendMail({
            from: `"Your BookKart" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: body,
        });
        console.log(`📩 Email sent successfully to ${to}`);
    }
    catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error);
    }
});
const sendVerificationToEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    const html = `
       <h1>Welcome To Your BookKart! Verify Your Email</h1>
       <p>Thank you for registering. Please click on the link below to verify your email address:</p>
       <a href="${verificationUrl}">Verify Email Here</a>
       <p>If you didn't request this or have already verified, please ignore this email.</p>
    `;
    yield sendEmail(to, "Please verify your email to access BookKart", html);
});
exports.sendVerificationToEmail = sendVerificationToEmail;
const sendResetPasswordLinkToEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const html = `
       <h1>Welcome To Your BookKart! Reset Your Password</h1>
       <p>You have requested to reset your password. Click the link below to set a new password:</p>
       <a href="${resetUrl}">Reset Password Here!</a>
       <p>If you didn't request this, please ignore this email and your password will remain the same.</p>
    `;
    yield sendEmail(to, "Please Reset Your Password", html);
});
exports.sendResetPasswordLinkToEmail = sendResetPasswordLinkToEmail;
