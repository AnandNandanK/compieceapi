import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { UserRole } from "../generated/prisma/enums.js";

/**
 * Restrict access to certain roles
 * @param allowedRoles - array of roles allowed to access the route
 */
export const authorize =
  (allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user; // assume auth middleware already set req.user

    if (!user) {
      return next(new AppError("Not authenticated", 401));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(new AppError("You do not have permission to access this resource", 403));
    }

    next();
  };
