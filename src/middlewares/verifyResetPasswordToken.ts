import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { UserRole } from "../generated/prisma/enums.js";
import { env } from "../config/env.js";

export const verifyResetPasswordToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let resetToken: string | null = null;

  // 1️⃣ Extract Bearer token
  if (req.headers.authorization?.startsWith("Bearer ")) {
    resetToken = req.headers.authorization.split(" ")[1];
  }


  if (!resetToken) {
    throw new AppError("Reset token missing", 400);
  }

  try {
    const decoded = jwt.verify(resetToken,env.RESET_TOKEN_SECRET!) as {
      userId: number;
      type: string;
      role: UserRole;
    };
   
    // 2️⃣ Ensure token type
    if (decoded.type !== "password_reset") {
      throw new AppError("Invalid reset token", 403);
    }

    // 3️⃣ Attach to request
    req.resetUser = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    throw new AppError("Reset token expired or invalid", 401);
  }
};
