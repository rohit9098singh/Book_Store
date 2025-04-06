import { NextFunction, Request, Response } from "express";
import { response } from "../utils/responseHandler";
import jwt  from "jsonwebtoken"

declare global {
    namespace Express {
      interface Request {
        id: string;
      }
    }
  }
  

  const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.cookies["access_token"]; 

    if (!token) {
      return response(res, 401, "User not authenticated, no token available");
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
  
      if (!decoded || !decoded.userId) {
        return response(res, 401, "User not authorized, invalid payload");
      }
  
      req.id = decoded.userId;
      next();
    } catch (error) {
      return response(res, 400, "Not authorized, token not valid or expired");
    }
  };
  
  export {authenticateUser}