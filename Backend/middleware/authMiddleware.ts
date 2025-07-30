import { NextFunction, Request, Response } from "express";
import { response } from "../utils/responseHandler";
import jwt  from "jsonwebtoken"

declare global {
    namespace Express {
      interface Request {
        id: string;
        role:string
      }
    }
  }
  

  const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Get token from Authorization header
    let token;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return response(res, 401, "User not authenticated, no token available");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

      if (!decoded || !decoded.userId) {
        return response(res, 401, "User not authorized, invalid payload");
      }

      req.id = decoded.userId;
      req.role = decoded.role;
      next();
    } catch (error) {
      return response(res, 400, "Not authorized, token not valid or expired");
    }
  };
  
  export {authenticateUser}