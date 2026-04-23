import { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client.js";

import { AppError } from "../utils/AppError.js";

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseUtil.js";

// Handle JWT errors
const handleJsonWebTokenError = (error: any): AppError => {
  return new AppError("Invalid token. Please log in again.", 401);
};

// Development error: detailed
const sendErrorDev = (err: any, req: Request, res: Response) => {
  console.log(err);
  return sendErrorResponse(
    req,
    res,
    err.message,
    { ...err, stack: err.stack },
    err.statusCode
  );
};

// Production error: limited info
const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  if (err.isOperational) {
    // Safe to send message
    return sendErrorResponse(req, res, err.message, undefined, err.statusCode);
  }

  // Unknown or programming error
  console.error("💥 UNEXPECTED ERROR:", err);
  return sendErrorResponse(req, res, "Something went wrong!", undefined, 500);
};

// Global error middleware
const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = err.message || "Something went wrong!";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else {
    let error: AppError;

    // Preserve prototype
    if (err instanceof AppError) {
      error = err;
    } else {
      error = Object.create(err);
    }

    // Handle JWT errors
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      error = handleJsonWebTokenError(error);
    }

    // Handle Prisma unique constraint error
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const fields = (error.meta?.target as string[]) || [];
      error = new AppError(`Duplicate value for field(s): ${fields}`, 409);
    }
    if (err instanceof SyntaxError && "body" in err)
      error = new AppError(`Invalid json in request body`, 400);

    sendErrorProd(error, req, res);
  }
};

export default globalErrorHandler;
