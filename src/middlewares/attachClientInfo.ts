import { Request, Response, NextFunction } from "express";

// Extend Request type to include clientIp and userAgent
declare module "express-serve-static-core" {
  interface Request {
    clientIp?: string;
    userAgent?: string;
  }
}

const privateIpPatterns = [
  /^127\./, // localhost
  /^10\./, // Class A private
  /^192\.168\./, // Class C private
  /^172\.(1[6-9]|2\d|3[0-1])\./, // Class B private
];


export const attachClientInfo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get IP (proxy safe)
  const rawIp =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    null;

  if (rawIp) {
    // Check if IP is private
    const isPrivate = privateIpPatterns.some((pattern) => pattern.test(rawIp));
    req.clientIp = isPrivate ? undefined : rawIp;
  }

  // Get User-Agent
  req.userAgent = (req.headers["user-agent"] as string) || undefined;
  // get existing correlation id in cookie
  next();
};
