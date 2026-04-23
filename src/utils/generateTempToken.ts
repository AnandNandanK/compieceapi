import jwt from "jsonwebtoken";

export function generateTempToken(userId: number) {
  return jwt.sign(
    { id: userId, type: "otp_verify" },
    process.env.TEMP_TOKEN_SECRET!,
    { expiresIn: "5m" }
  );
}
