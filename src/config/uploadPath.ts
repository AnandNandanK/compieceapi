import path from "path";
import fs from "fs";
import { env } from "./env.js";
import { fatalShutdown } from "../utils/fatalShutdown.js";

export const UPLOAD_PATH = path.resolve(env.UPLOAD_DIR);

try {
  if (!fs.existsSync(UPLOAD_PATH)) {
    fs.mkdirSync(UPLOAD_PATH, { recursive: true });
  }
} catch (error) {
  fatalShutdown(
    `Failed to initialize upload directory at "${UPLOAD_PATH}"\nReason: ${
      (error as Error).message
    }`,
    { title: "UPLOAD DIRECTORY ERROR" }
  );
}
