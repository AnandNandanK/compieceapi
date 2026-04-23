import rateLimit from "express-rate-limit";

/**
 * AUTH / SENSITIVE ROUTES
 * signup, login, otp, forgot-password, reset-password
 */
export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many attempts. Please try again later.",
  },
});

/**
 * REFRESH TOKEN
 */
export const refreshTokenLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many refresh attempts.",
  },
});
