// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { UserService } from "../services/userServices.js";
// import { UserRole } from "../prismaClient/enums";

// ✅ Extend Express Request type

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | null = null;

    // 1️⃣ Extract Bearer token
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError(
        "You are not authorized to perform this operation",
        401
      );
    }

    try {
      // 2️⃣ Verify token
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as {
        id: string;
        type: string;
      };
      if (decoded.type !== "access_token") {
        throw new AppError("Invalid token", 403);
      }

      // 3️⃣ Get user safely from DB
      const existingUser = await UserService.getUserById(Number(decoded.id));
      if (!existingUser || !existingUser.isActive) {
        throw new AppError(
          "You are not authorized to perform this operation",
          401
        );
      }

      req.user = {
        userId: existingUser.id,
        role: existingUser.role,
      };

      // 5️⃣ Continue request
      next();
    } catch (err) {
      throw new AppError(
        "You are not authorized to perform this operation",
        401
      );
    }
  }
);

export default authMiddleware;
