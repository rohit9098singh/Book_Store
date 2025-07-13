import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.log(" Gmail services are not ready to send emails. Please check the email configuration.");
    } else {
        console.log("✅ Gmail services are ready to send emails.");
    }
});

const sendEmail = async (to: string, subject: string, body: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"Your BookKart" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: body,
        });
        console.log(`📩 Email sent successfully to ${to}`);
        return info;
    } catch (error) {
        console.error(` Failed to send email to ${to}:`, error);
        return null;
    }
};


export const sendVerificationToEmail = async (to: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const html = `
     <h1>Welcome To Your BookKart! Verify Your Email</h1>
     <p>Thank you for registering. Please click on the link below to verify your email address:</p>
     <a href="${verificationUrl}">Verify Email Here</a>
     <p>If you didn't request this or have already verified, please ignore this email.</p>
  `;
  return await sendEmail(to, "Please verify your email to access BookKart", html); // ✅ return here
};


export const sendResetPasswordLinkToEmail = async (
  to: string,
  token: string
) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const html = `
    <h1>Reset Your Password - BookKart</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  return await sendEmail(to, "Reset your BookKart password", html);
};
