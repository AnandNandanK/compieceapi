import jwt, { SignOptions } from "jsonwebtoken";
import { UserRole } from "../generated/prisma/enums";

const generateRefreshToken = (userId: number, role: UserRole) => {
  return jwt.sign(
    {
      id: userId,
      type: "refresh_token",
      role,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "1d" } as SignOptions
  );
};
//refresh token
const generateAccessToken = (userId: number, role: UserRole
) => {
  return jwt.sign(
    {
      id: userId,
      type: "access_token",
      role,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "30m" } as SignOptions
  );
};
export { generateAccessToken, generateRefreshToken };
