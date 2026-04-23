import { z } from "zod";
import { fatalShutdown } from "../utils/fatalShutdown.js";

const csv = z.string().transform((v) => v.split(",").map((x) => x.trim()));

const duration = z.string().regex(/^\d+[smhd]$/, {
  message: "must be like 15m, 1d, 5h",
});

const envSchema = z.object({
  // 🌍 App
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535),

  // 🛢 Database
  DATABASE_URL: z.url(),
  // DATABASE_HOST: z.string().min(1),
  // DATABASE_PORT: z.coerce.number().int().min(1),
  // DATABASE_USER: z.string().min(1),
  // DATABASE_PASSWORD: z.string().min(1),
  // DATABASE_NAME: z.string().min(1),
  FRONTEND_URL: z.url(),
  // 🔐 Auth
  ACCESS_TOKEN_SECRET: z.string().min(10),
  REFRESH_TOKEN_SECRET: z.string().min(10),
  TEMP_TOKEN_SECRET: z.string().min(10),
  RESET_TOKEN_SECRET: z.string().min(10),
  ACCESS_TOKEN_EXPIRES_IN: duration,
  REFRESH_TOKEN_EXPIRES_IN: duration,
  DEFAULT_PASS_CHANGE_ACCESS_TOKEN_EXPIRES_IN: duration,

  PASSWORD_SALT_ROUND: z.coerce.number().int().min(8),
  PASSWORD_LENGTH: z.coerce.number().int().min(8),
  OTP_RESEND_MINUTES: z.coerce.number().int().min(1),

  // 📧 Email
  EMAIL_USER: z.email(),
  EMAIL_PASS: z.string().min(8),
  NOTIFICATION_EMAILS: csv,

  // 🌐 URLs
  LOGIN_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string().min(5),
  GOOGLE_CLIENT_SECRET: z.string().min(10),
  GOOGLE_REDIRECT_URI: z.url(),

  // 🔒 CORS
  CORS_URLS: csv,

  // 📁 Storage
  UPLOAD_DIR: z.string().min(1),
  DESCRIPTION_LIMIT: z.coerce.number().int().min(100),
  BLOG_CONTENT_LIMIT: z.coerce.number().int().min(100)
});

// ================================
// Validate ENV
// ================================
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errors = parsed.error.issues
    .map((e) => `• ${e.path.join(".")}: ${e.message}`)
    .join("\n");

  fatalShutdown(errors, {
    title: "❌ ENV CONFIG ERROR",
    exitCode: 1,
  });
}

export const env = parsed.data;
