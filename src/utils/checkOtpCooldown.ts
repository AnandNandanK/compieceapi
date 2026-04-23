import { AppError } from "./AppError.js";

export function checkOtpCooldown(lastOtpSentAt?: Date) {
  if (!lastOtpSentAt) return;

  const now = Date.now();
  const last = lastOtpSentAt.getTime();

  // Read from env → fallback to 1 minute
  const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 1);

  const cooldownWindow = OTP_EXPIRY_MINUTES * 60 * 1000; // minutes → ms

  if (now - last < cooldownWindow) {
    const secLeft = Math.ceil((cooldownWindow - (now - last)) / 1000);
    throw new AppError(
      `Wait ${secLeft} seconds before resending OTP.`,
      429
    );
  }
}
