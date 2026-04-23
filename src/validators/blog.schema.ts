import { z } from "zod";
import stripHtml from "../utils/stripeHtml.js";
import { env } from "../config/env.js";

/* =====================================================
   COMMON HELPERS
===================================================== */

/**
 * Coerce numeric IDs (supports form-data & JSON)
 */
const positiveId = z.coerce.number().int().positive("Invalid ID provided");

/**
 * Blog content validation (HTML allowed, length limited)
 */
const blogContentSchema = z
  .string("Blog content is required")
  .trim()
  .min(1, "Blog content cannot be empty")
  .refine(
    (val) => {
      const plainText = stripHtml(val);
      return plainText.length <= env.BLOG_CONTENT_LIMIT;
    },
    {
      message: `Blog content must be within ${env.BLOG_CONTENT_LIMIT} characters`,
    }
  );

/* =====================================================
   CREATE BLOG
===================================================== */

const createBlogSchema = z.object({

  
  locationId: positiveId,
  content: blogContentSchema,

});

export const createBlogRequestSchema = z.object({
  body: createBlogSchema,
});
