// middleware/setUserTypeMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { UserRole } from "../generated/prisma/enums.js";

// ✅ Extend Express Request type
declare module "express-serve-static-core" {
  interface Request {
    reqLoginUserType?: UserRole[];
  }
}

export const setLoginUserType = (role: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.reqLoginUserType = role;
    next();
  };
};
