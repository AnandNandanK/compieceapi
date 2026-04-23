import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export interface TempUserPayload {
  id: number;
  type: string;
}


export const verifyTempToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let tempToken: string | null = null;

  
  // 1️⃣ Extract Bearer token
  if (req.headers.authorization?.startsWith("Bearer ")) {
    tempToken = req.headers.authorization.split(" ")[1];
  }

  if (!tempToken) {
    throw new AppError("Verification token missing", 400);
  }

  try {
    const decoded = jwt.verify(
      tempToken,
      process.env.TEMP_TOKEN_SECRET!
    ) as TempUserPayload;

    if (decoded.type !== "otp_verify") {
      throw new AppError("Invalid token type", 403);
    }

    req.tempUser = {
      userId: decoded.id,
    };

    next();
  } catch (err) {
    throw new AppError("Temp token expired or invalid", 401);
  }
};
