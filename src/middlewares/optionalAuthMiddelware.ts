// middleware/optionalAuthMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { UserService } from "../services/userServices.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

const optionalAuthMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | null = null;

    // 1️⃣ Extract Bearer token
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 🔓 No token → PUBLIC USER (allowed)
    if (!token) {
      return next();
    }

    try {
      // 2️⃣ Verify token
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as {
        id: string;
      };

      // 3️⃣ Fetch user from DB
      const existingUser = await UserService.getUserById(Number(decoded.id));

      if (!existingUser || !existingUser.isActive) {
        throw new AppError("Unauthorized", 401);
      }

      // 4️⃣ Attach user to request
      req.user = {
        userId: existingUser.id,
        role: existingUser.role,
      };

      next();
    } catch (err) {
      // 🚨 Token was provided but invalid → reject
      throw new AppError("Invalid or expired token", 401);
    }
  }
);

export default optionalAuthMiddleware;
