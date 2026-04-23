import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

// Extend Request type to include traceId
declare module "express-serve-static-core" {
  interface Request {
    correlationId: string;
  }
}

export const attachCorrelationId = (req: Request, res: Response, next: NextFunction) => {
  // Generate a UUID v4 trace ID
  req.correlationId = uuidv4();
  next();
};
