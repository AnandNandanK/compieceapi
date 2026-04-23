import express, { Application, Request, Response, NextFunction } from "express";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";

import cookieParser from "cookie-parser";


import path from "path";

import cors from "cors";
import { AppError } from "./utils/AppError";
import globalErrorHandler from "./middlewares/globalErrorHandler";

import authRouter from "./routes/auth.routes";

// Import routes (create empty files for now)
// import userRoutes from "./modules/user/user.routes";
// import subscriptionRoutes from "./modules/subscription/subscription.routes";
// import callbackRoutes from "./modules/callback/callback.routes";

const app: Application = express();

// Middleware
// app.use(helmet()); // Security headers
// app.use(cors());

const whitelistOrigins = process.env.CORS_URLS?.split(",");
const corsOptions = {
  origin: whitelistOrigins,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
console.log("Allowed origins are:", whitelistOrigins);

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Logging for dev
// if (process.env.NODE_ENV !== "production") {
//   app.use(morgan("dev"));
// }

// Health check
 
app.use(express.json()); // ✅ parses JSON body
app.use(express.urlencoded({ extended: true })); // ✅ parses form data

// To serve images publicly
const uploadPath = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(__dirname, "../../uploads");
app.use("/uploads", express.static(uploadPath));



app.use("/api/v1/auth", authRouter);



app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});

// handle fallback
app.all(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// Global error handler
app.use(globalErrorHandler);

export default app;
