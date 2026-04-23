import { Router } from "express";
import {
  forgotPassword,
  handleRefreshAccessToken,
  logout,
  resendOtp,
  resetPassword,
  userLogin,
  userSignup,
  verifyOtp,
} from "../controllers/authController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import refreshTokenAuthMiddleware from "../middlewares/refreshAuthMiddleware.js";
import { setLoginUserType } from "../middlewares/setLoginUserType.js";

import { UserRole } from "../generated/prisma/enums.js";

import { verifyTempToken } from "../middlewares/verifyTempToken.js";
import { googleCallback } from "../controllers/googleAuth.controllers.js";
import { validateRequest } from "../middlewares/validateRequest.js";

import {
  forgotPasswordRequestSchema,
  loginRequestSchema,
  resetPasswordRequestSchema,
  signupRequestSchema,
  verifyOtpRequestSchema,

} from "../validators/auth.schema.js";

import { verifyResetPasswordToken } from "../middlewares/verifyResetPasswordToken.js";

import {
  authLimiter,
  refreshTokenLimiter,
} from "../middlewares/rateLimiter.js";

const router = Router();

router.post(
  "/signup",
  authLimiter,
  validateRequest(signupRequestSchema),
  userSignup
);

router.post(
  "/verify-otp",
  authLimiter,
  validateRequest(verifyOtpRequestSchema),
  verifyTempToken,
  verifyOtp
);

router.post(
  "/resend-otp",
  authLimiter,
  verifyTempToken,
  resendOtp
);

router.post(
  "/login",
  authLimiter,
  setLoginUserType([UserRole.ADMIN, UserRole.CUSTOMER]),
  validateRequest(loginRequestSchema),
  userLogin
);

router.post("/google/verify", authLimiter, googleCallback);

router.post("/logout", authMiddleware, logout);

router.get(
  "/accesstoken/refresh",
  refreshTokenLimiter,
  refreshTokenAuthMiddleware,
  handleRefreshAccessToken
);

router.post(
  "/forgot-password",
  authLimiter,
  validateRequest(forgotPasswordRequestSchema),
  forgotPassword
);

router.post(
  "/reset-password",
  authLimiter,
  verifyResetPasswordToken,
  validateRequest(resetPasswordRequestSchema),
  resetPassword
);

export default router;
