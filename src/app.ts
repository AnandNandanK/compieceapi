import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

import { AppError } from "./utils/AppError.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import authRouter from "./routes/auth.routes.js";

const app: Application = express();

// ✅ Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS safe
const whitelistOrigins = process.env.CORS_URLS
  ? process.env.CORS_URLS.split(",")
  : [];

const corsOptions = {
  origin: whitelistOrigins.length ? whitelistOrigins : true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

// ✅ Body parsers (only once)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ Trust proxy (Render)
app.set("trust proxy", 1);

// ✅ Static uploads
const uploadPath = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(__dirname, "../../uploads");

app.use("/uploads", express.static(uploadPath));

// ✅ Routes
app.use("/api/v1/auth", authRouter);

// ✅ Health check
app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});

// ✅ 404 handler
app.all(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ✅ Global error handler
app.use(globalErrorHandler);

export default app;