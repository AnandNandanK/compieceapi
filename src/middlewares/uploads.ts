import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import type { Request } from "express";
import { UPLOAD_PATH } from "../config/uploadPath.js";

/* =====================================================
   CONSTANTS
===================================================== */

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/mov"];

const IMAGE_SIZE_LIMIT = 5 * 1024 * 1024;   // 5MB
const VIDEO_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB

/* =====================================================
   HELPERS
===================================================== */

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const getUploadSubFolder = (req: Request): string => {
  const url = req.originalUrl; // ✅ IMPORTANT

  if (url.includes("/packages")) return "packages";
  if (url.includes("/me")) return "profiles";
  if (url.includes("/hotels")) return "hotels";
  if (url.includes("/banners")) return "banners";

  if (url.includes("/blogs/image")) return "blogs/temp/images";
  if (url.includes("/blogs/video")) return "blogs/temp/videos";

  return "misc";
};


/* =====================================================
   STORAGE
===================================================== */

const storage = multer.diskStorage({
  destination: (req: Request, _file, cb) => {
    const subFolder = getUploadSubFolder(req);
    const fullPath = path.join(UPLOAD_PATH, subFolder);
    ensureDir(fullPath);
    cb(null, fullPath);
  },

  filename: (_req: Request, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

/* =====================================================
   MULTER INSTANCE
===================================================== */

export const upload = multer({
  storage,

  limits: {
    fileSize: VIDEO_SIZE_LIMIT, // max possible (checked manually below)
  },

  fileFilter: (req: Request, file, cb) => {
    // IMAGE
    if (req.baseUrl.includes("/blogs/image")) {
      if (!IMAGE_TYPES.includes(file.mimetype)) {
        return cb(new Error("Only image files are allowed"));
      }
    }

    // VIDEO
    if (req.baseUrl.includes("/blogs/video")) {
      if (!VIDEO_TYPES.includes(file.mimetype)) {
        return cb(new Error("Only video files are allowed"));
      }
    }

    cb(null, true);
  },
});

/* =====================================================
   SAFE DELETE
===================================================== */

export const deleteFile = (filePath: string) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
