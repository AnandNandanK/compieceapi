import dotenv from "dotenv";
import http, { Server } from "http";

// ================================
// 1️⃣ Load ENV FIRST (CRITICAL)
// ================================
const nodeEnv = process.env.NODE_ENV || "development";
const envFile = nodeEnv === "production" ? ".env.production" : ".env";

dotenv.config({
  path: `${process.cwd()}/${envFile}`,
});

console.log(`🌱 Loaded env file: ${envFile}`);
console.log(`PORT from env:`, process.env.PORT);

// ================================
// Globals
// ================================
let server: Server | undefined;
let isShuttingDown = false;

// ================================
// 2️⃣ Bootstrap AFTER env
// ================================
async function bootstrap(): Promise<void> {
  try {
    // 🔑 IMPORTANT: dynamic imports
    const { env } = await import("./config/env.js");
    const { default: app } = await import("./app.js");

    const PORT = Number(process.env.PORT) || 5000;

    server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(
        `🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`
      );
    });
  } catch (err) {
    console.error("❌ Failed to start server", err);
    process.exit(1);
  }
}

bootstrap();

// ================================
// 3️⃣ Graceful Shutdown
// ================================
async function shutdown(reason: string): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\n🛑 Shutdown initiated (${reason})`);

  const forceExitTimer = setTimeout(() => {
    console.error("⏱️ Force exit after timeout");
    process.exit(1);
  }, 10_000);

  try {
    if (server) {
      await new Promise<void>((resolve) => {
        server!.close(() => {
          console.log("✅ HTTP server closed");
          resolve();
        });
      });
    }

    const { prisma } = await import("./lib/prisma.js");
    await prisma.$disconnect();
    console.log("✅ Database disconnected");
  } catch (err) {
    console.error("❌ Error during shutdown", err);
  } finally {
    clearTimeout(forceExitTimer);
    console.log("👋 Process exiting");
    process.exit(0);
  }
}

// ================================
// 4️⃣ Signals
// ================================
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// ================================
// 5️⃣ Crash Protection
// ================================
process.on("uncaughtException", (err: Error) => {
  console.error("💥 Uncaught Exception", err);
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error("💥 Unhandled Rejection", reason);
  shutdown("unhandledRejection");
});
