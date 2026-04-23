// middlewares/fileValidator.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import path from "path";
import fs from "fs";

const MAX_FILE_SIZE_MB = 5; // you can change this limit

export const validateExcelFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file = req.file;

  // 1️⃣ Check if file exists
  if (!file) {
    throw new AppError("Excel file is required", 400);
  }

  // 2️⃣ Validate file type
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".xlsx") {
    // delete temp file if invalid
    fs.unlinkSync(file.path);
    throw new AppError("Only .xlsx files are allowed", 400);
  }

  // 3️⃣ Validate file size (in bytes)
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    fs.unlinkSync(file.path);
    throw new AppError(`File too large. Max size is ${MAX_FILE_SIZE_MB}MB`, 400);
  }

  next();
};
