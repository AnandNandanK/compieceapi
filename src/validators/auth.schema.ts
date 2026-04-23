import { z } from "zod";
import { env } from "../config/env.js";

export const loginSchema = z.object({
  email: z.email("Invalid email format").min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});
export const loginRequestSchema = z.object({
  body: loginSchema,
});

/* reusable password rules */
export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(
    env.PASSWORD_LENGTH,
    `Password must be at least ${env.PASSWORD_LENGTH} characters`
  )
  .regex(/[a-z]/, "Password must contain one lowercase letter")
  .regex(/[A-Z]/, "Password must contain one uppercase letter")
  .regex(/[0-9]/, "Password must contain one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain one special character");

  
export const signupSchema = z.object({
  email: z.email("Invalid email").min(1, "Email is required"),

  password: passwordSchema,

  name: z.string().min(1, "Name is required"),

  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),

  address: z.string().optional(),
});

export const signupRequestSchema = z.object({
  body: signupSchema,
});

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .min(1, "OTP is required")
    .regex(/^\d{6}$/, "OTP must be a 6-digit number"),
});

export const verifyOtpRequestSchema = z.object({
  body: verifyOtpSchema,
});


 const forgotPasswordSchema = z.object({
  email: z.email("Invalid email format").min(1, "Email is required"),
});

export const forgotPasswordRequestSchema = z.object({
  body: forgotPasswordSchema,
});
const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
});

export const resetPasswordRequestSchema = z.object({
  body: resetPasswordSchema,
});
