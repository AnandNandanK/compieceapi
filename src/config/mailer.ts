import nodemailer from "nodemailer";
import { env } from "./env.js";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER, // your email
    pass: env.EMAIL_PASS, // app password (not your Gmail login password)
  },
});
export default transporter;
