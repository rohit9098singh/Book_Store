import { Request, Response } from "express";
import User from "../models/User";
import { response } from "../utils/responseHandler";
import crypto from "crypto";
import {
  sendResetPasswordLinkToEmail,
  sendVerificationToEmail,
} from "../config/emailConfig";
import { generateToken } from "../utils/generateToken";
const bcrypt = require("bcryptjs");

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, agreeTerms } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response(res, 400, "User Already Exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(20).toString("hex");

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      agreeTerms,
      verificationToken,
    });

    await newUser.save();

    const result = await sendVerificationToEmail(
      newUser.email,
      verificationToken
    );
    console.log("Verification email result:", result);

    return response(
      res,
      200,
      "User Registered Successfully. Please check your email to verify your account.",
      {
        email: newUser.email,
        name: newUser.name,
      }
    );
  } catch (error: any) {
    console.log(error);
    return response(res, 500, "Internal server error", error.message);
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return response(res, 400, "invalid or expired verification token");
    }

    if (user.isVerified) {
      return response(res, 400, "Email is already verified");
    }

    user.isVerified = true;
    user.verificationToken = undefined; // so it can’t be reused

    const accessToken = generateToken(user);
    await user.save();

    return response(res, 200, "Email verified successfully", { token: accessToken });
  } catch (error: any) {
    console.log(error);
    return response(res, 500, "Internal server error", error.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return response(res, 400, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response(res, 400, "Invalid email or password");
    }

    if (!user.isVerified) {
      return response(res, 400, "Please verify your email before login");
    }

    const accessToken = generateToken(user);
    return response(res, 200, "User logged in successfully", {
      user: user.name,
      email: user.email,
      verificationToken: user.verificationToken,
      token: accessToken
    });
  } catch (error: any) {
    console.log(error);
    return response(res, 500, "Internal server error", error.message);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return response(res, 400, "No account found with this email");
    }
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    user.save();

    await sendResetPasswordLinkToEmail(user.email, resetPasswordToken);
    return response(
      res,
      200,
      "A password reset link has been send to your email address"
    );
  } catch (error: any) {
    console.log(error);
    return response(res, 500, "Internal server error", error.message);
  }
};   

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password: newpassword } = req.body; // new password he name hai
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return response(res, 400, "invalid or expired reset password token");
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return response(
      res,
      200,
      "your password has been reset successfully now you can login with your new password"
    );
  } catch (error: any) {
    console.log(error);
    return response(res, 500, "Internal server error", error.message);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Since we're using localStorage now, the frontend handles token removal
    // No need to check or clear cookies on the backend
    return response(res, 200, "Successfully Logged out");
  } catch (error: any) {
    return response(res, 500, "Internal server error", error.message);
  }
};

export const checkUserAuth = async (req: Request, res: Response) => {
  try {
    const userId = req?.id;
    if (!userId) {
      return response(
        res,
        400,
        "Unauthorized, please login to access our page"
      );
    }

    const user = await User.findById(userId).select(
      "-password -verificationToken -resetPasswordExpires -restPasswordToken "
    );

    if (!user) {
      return response(res, 403, "User not found");
    }

    return response(res, 200, "User retrieved successfully", user);
  } catch (error: any) {
    return response(res, 500, "Internal server error", error.message);
  }
};

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
