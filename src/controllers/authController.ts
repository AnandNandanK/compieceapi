import { UserService } from "../services/userServices.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { Request, Response } from "express";

import bcrypt from "bcryptjs";

import { sendSuccessResponse } from "../utils/responseUtil.js";

import ms, { StringValue } from "ms";

import { generateOtp, hashOtp } from "../utils/otp.js";

import { checkOtpCooldown } from "../utils/checkOtpCooldown.js";

import { generateTempToken } from "../utils/generateTempToken.js";
import { generatePasswordResetToken } from "../utils/generateResetPasswordToken.js";
import { sendResetPasswordEmail } from "../utils/emailUtils/sendResetPasswordEmail.js";

import { sendOtpEmail } from "../utils/emailUtils/sendOtpMail.js";
import { env } from "../config/env.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateAuthJwt.js";


//env variables
const saltRound = Number(env.PASSWORD_SALT_ROUND || 10);
const refreshMaxAge = ms((env.REFRESH_TOKEN_EXPIRES_IN as StringValue) || "1d");

const userLogin = asyncHandler(async (req: Request, res: Response) => {
  //validation handled using zod in middlewares
  const { email, password } = req.body;

  const user = await UserService.getUserByEmail(email);

  if (!user || !user.isActive) throw new AppError("Invalid credentials", 401);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError("Invalid credentials.", 401);

  const refreshToken = generateRefreshToken
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: refreshMaxAge,
  });

  const accessToken = generateAccessToken(user.id, user.role);


  return sendSuccessResponse(
    req,
    res,
    "Login successful",
    {
      accessToken,
      role: user.role,
      expiresIn: ms(env.ACCESS_TOKEN_EXPIRES_IN as StringValue),
    },
    200
  );
});


const userSignup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name, phone, address } = req.body;

  const existingUser = await UserService.getUserByEmail(email);

  // CASE 1: already verified
  if (existingUser && existingUser.isActive) {
    throw new AppError("Email already registered. Please login.", 400);
  }

  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  const hashedPassword = await bcrypt.hash(password, saltRound);

  let user;

  // CASE 2: existing but not verified
  if (existingUser && !existingUser.isActive) {
    checkOtpCooldown(existingUser.lastOtpSentAt || undefined);

    user = await UserService.updateUserOtpAndPasswordById({
      id: existingUser.id,
      otpHash,
      otpExpiresAt,
      hashedPassword,
    });
  }
  // CASE 3: new user
  else {
    user = await UserService.createUser({
      email,
      hashedPassword,
      otpHash,
      otpExpiresAt,
      name,
      phone,
      address,
    });
  }

  const tempToken = generateTempToken(user.id);
  const otpTimer = Number(env.OTP_RESEND_MINUTES || 2);

  sendSuccessResponse(
    req,
    res,
    "OTP sent to email.",
    { tempToken, timer: otpTimer },
    200
  );

  await sendOtpEmail(email, otp);
});

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  if (!req.tempUser) throw new AppError("Invalid request.", 400);
  const { userId } = req.tempUser;
  const user = await UserService.getUserById(userId);
  if (!user) throw new AppError("User not found", 404);
  if (user.isActive) throw new AppError("Already verified", 400);

  // Apply COOLDOWN
  if (user.lastOtpSentAt) checkOtpCooldown(user.lastOtpSentAt);
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const otpTimer = Number(env.OTP_RESEND_MINUTES || 2);

  await UserService.updateUserOtpById({
    id: user.id,
    otpHash,
    otpExpiresAt: otpExpiresAt,
  });

  sendSuccessResponse(req, res, "OTP resent", { timer: otpTimer }, 200);
  await sendOtpEmail(user.email, otp);
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { otp } = req.body;
  if (!req.tempUser) throw new AppError("Invalid request.", 400);

  const { userId } = req.tempUser;

  // Fetch user
  const user = await UserService.getUserById(userId);
  if (!user) throw new AppError("User not found.", 404);

  // Check already verified
  if (user.isActive) {
    throw new AppError("Account already verified.", 400);
  }

  // Check OTP expiry
  if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    throw new AppError("OTP expired. Please request a new one.", 400);
  }

  // Convert OTP to string before hashing
  const otpString = String(otp);
  const hashedInputOtp = hashOtp(otpString);

  // Compare hashed OTP
  if (hashedInputOtp !== user.otpHash) {
    throw new AppError("Invalid OTP.", 400);
  }

  // Mark user verified + clear OTP
  await UserService.markUserVerified(userId);

  // Issue refresh token
  const refreshToken = generateRefreshToken(userId, user.role);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: refreshMaxAge,
  });

  // Issue access token
  const accessToken = generateAccessToken(userId, user.role);

  // Send success response
  return sendSuccessResponse(
    req,
    res,
    "Signup successful",
    {
      accessToken,
      role: user.role,
      expiresIn: ms(env.ACCESS_TOKEN_EXPIRES_IN as StringValue),
    },
    200
  );
});

export const handleRefreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    // Middleware has already verified the refresh token and attached user
    if (!req.user) throw new AppError("Unauthorized", 401);
    const user = req.user;
    // const userDetails=
    const accessToken = generateAccessToken(Number(user.userId), user.role);
    // Send new access token
    return sendSuccessResponse(
      req,
      res,
      "Access token refreshed",
      {
        accessToken,
        role: user.role,
        expiresIn: ms(env.ACCESS_TOKEN_EXPIRES_IN as StringValue),
      },
      200
    );
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await UserService.getUserByEmail(email);
    if (!user || !user.isActive) {
      return sendSuccessResponse(
        req,
        res,
        "Password reset link sent to email",
        null,
        200
      );
    }

    const resetToken = generatePasswordResetToken(user.id, user.role);

    const resetLink = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    sendSuccessResponse(
      req,
      res,
      "Password reset link sent to email",
      null,
      200
    );
    await sendResetPasswordEmail(email, resetLink);
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { newPassword } = req.body;
    const userId = req.resetUser?.userId;

    const hashedPassword = await bcrypt.hash(newPassword, saltRound);

    await UserService.updateUserPasswordById(Number(userId), hashedPassword);

    return sendSuccessResponse(
      req,
      res,
      "Password reset successful",
      null,
      200
    );
  }
);

const logout = asyncHandler(async (req: Request, res: Response) => {
  // Clear the refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
  });

  // Optionally, you can also blacklist the token in DB/Redis if needed

  return sendSuccessResponse(req, res, "Logged out successfully", null, 200);
});
export { userLogin, logout, userSignup };
