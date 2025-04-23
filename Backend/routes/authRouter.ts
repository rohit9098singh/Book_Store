import { NextFunction, Request, Response, Router } from "express";
import {checkUserAuth, forgotPassword, login, logout, register, resetPassword, verifyEmail} from "../controllers/authController"
import {authenticateUser} from "../middleware/authMiddleware"
import passport from "passport";
import { IUser } from "../models/User";
import { generateToken } from "../utils/generateToken";

const router=Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/logout",logout)
router.get("/verify-auth",authenticateUser,checkUserAuth)

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

//google callback route
router.get("/google/callback",passport.authenticate("google",{failureRedirect:`${process.env.FRONTEND_URL}`,session:false}),
async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
        const user=req.user as IUser
        const accessToken=await generateToken;
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            sameSite:"none",
            secure:true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          res.redirect(`${process.env.FRONTEND_URL}`)
    } catch (error) {
        next(error)
    }
}
)

export default router;