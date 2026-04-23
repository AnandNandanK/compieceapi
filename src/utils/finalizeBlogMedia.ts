import fs from "fs";
import path from "path";
import { UPLOAD_PATH } from "../config/uploadPath.js";

/**
 * Moves temp blog media to permanent folder
 * Handles absolute + relative URLs
 */
export const finalizeBlogMedia = (content: string): string => {
  let updatedContent = content;

  const tempMediaRegex =
    /(https?:\/\/[^"'<> ]+)?(\/?uploads\/blogs\/temp\/(images|videos)\/[^\s"'<>]+)/g;

  updatedContent = updatedContent.replace(
    tempMediaRegex,
    (_match, _baseUrl, relativePath) => {
      // remove leading slash
      let cleanPath = relativePath.replace(/^\/+/, "");

      // 🔥 REMOVE `uploads/` PREFIX
      // uploads/blogs/temp/images/x.jpg → blogs/temp/images/x.jpg
      if (cleanPath.startsWith("uploads/")) {
        cleanPath = cleanPath.replace(/^uploads\//, "");
      }

      const fileName = path.basename(cleanPath);
      const isImage = cleanPath.includes("/images/");
      const mediaType = isImage ? "images" : "videos";

      const tempFullPath = path.join(UPLOAD_PATH, cleanPath);
      const finalRelativePath = `uploads/blogs/${mediaType}/${fileName}`;
      const finalFullPath = path.join(
        UPLOAD_PATH,
        "blogs",
        mediaType,
        fileName
      );

      // ensure final directory exists
      fs.mkdirSync(path.dirname(finalFullPath), { recursive: true });

      // move file
      if (fs.existsSync(tempFullPath)) {
        fs.renameSync(tempFullPath, finalFullPath);
      } else {
        console.warn("Temp file not found:", tempFullPath);
      }

      return finalRelativePath;
    }
  );

  return updatedContent;
};
