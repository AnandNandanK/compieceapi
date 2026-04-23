import fs from "fs";
import path from "path";
import { UPLOAD_PATH } from "../config/uploadPath.js";

export const deleteRemovedBlogMedia = (
  oldMedia: Set<string>,
  newMedia: Set<string>
) => {
  for (const oldPath of oldMedia) {
    if (!newMedia.has(oldPath)) {
      let cleanPath = oldPath;

      // 🔥 REMOVE `uploads/` PREFIX
      // uploads/blogs/images/x.jpg → blogs/images/x.jpg
      if (cleanPath.startsWith("uploads/")) {
        cleanPath = cleanPath.replace(/^uploads\//, "");
      }

      const fullPath = path.join(UPLOAD_PATH, cleanPath);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      } else {
        console.warn("File not found for deletion:", fullPath);
      }
    }
  }
};
