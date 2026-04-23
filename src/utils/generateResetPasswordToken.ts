import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UserRole } from "../generated/prisma/enums.js";

export const generatePasswordResetToken = (userId: number, role: UserRole) => {
  return jwt.sign(
    { userId, type: "password_reset", role },
    env.RESET_TOKEN_SECRET,
    { expiresIn: "15m" } // short lived
  );
};
