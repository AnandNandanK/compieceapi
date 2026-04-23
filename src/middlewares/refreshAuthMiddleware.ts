// middleware/refreshTokenAuthMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { UserService } from "../services/userServices.js";
import { UserRole } from "../generated/prisma/enums.js";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const refreshTokenAuthMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.refreshToken;
    console.log(token);
    if (!token) {
      throw new AppError("Invalid credentials", 401);
    }

    try {
      // 1️⃣ Verify refresh token

      const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as {
        id: number;
        type: string;
        role: UserRole;
      };

      // 2️⃣ Fetch user from DB safely based on role
      if (decoded.type !== "refresh_token")
        throw new AppError("Invalid credentials", 401);

      const existingUser = await UserService.getUserById(decoded.id);
      console.log(existingUser);
      if (!existingUser) {
        throw new AppError("Invalid credentials", 401);
      }
      if (existingUser && !existingUser.isActive)
        throw new AppError("Invalid credentials", 401);
      req.user = {
        userId: Number(existingUser.id),
        role: existingUser.role,
      };
      console.log("verified");
      next();
    } catch (err) {
      throw new AppError("Invalid credentials", 401);
    }
  }
);

export default refreshTokenAuthMiddleware;
