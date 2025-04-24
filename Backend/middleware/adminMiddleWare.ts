import { NextFunction, Request, Response } from "express";
import { response } from "../utils/responseHandler";

export const IsAdmin=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
        const role=req.role;
        if(role!=="admin"){
           return response(res,403,"forbidden admin access is required")
        }
        next();
    } catch (error) {
       return response(res,500,"internal server error") ;
    }
}