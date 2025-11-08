import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserRole } from "../models/user.model.js";

interface AuthJwtPayload {
  id: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthJwtPayload;
    }
  }
}

const checkAuth = (req: Request, res: Response, next: NextFunction): void | Response => {
  try {
    // Check if ACCESS_TOKEN_SECRET is configured
    if (!process.env.ACCESS_TOKEN_SECRET) {
      return res
        .status(500)
        .send(new ApiResponse(500, null, "Server configuration error"));
    }

    // Primary token source - cookies
    let token: string | undefined = req.cookies.auth_token || req.cookies['auth_token'];

    // Fallback token source - Authorization header
    if (!token) {
      const bearerAuth: string | undefined = req.headers.authorization;
      if (bearerAuth) {
        token = bearerAuth.split(" ")[1];
      }
    }

    if (!token) {
      return res
        .status(401)
        .send(new ApiResponse(401, null, "Authentication required"));
    }

    const userData = jwt.verify<AuthJwtPayload>(token, process.env.ACCESS_TOKEN_SECRET);

    if (!userData) {
      return res
        .status(401)
        .send(new ApiResponse(401, null, "Invalid or expired token"));
    }

    req.user = userData;

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .send(new ApiResponse(401, null, "Invalid or expired token"));
  }
};

export { checkAuth };