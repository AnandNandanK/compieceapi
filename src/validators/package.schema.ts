import { z } from "zod";
import stripHtml from "../utils/stripeHtml.js";
import { env } from "../config/env.js";

/* =====================================================
   COMMON HELPERS
===================================================== */

/**
 * Parse multipart/form-data arrays like "[1,2,3]"
 */
const jsonNumberArrayBase = z.preprocess((val) => {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
}, z.array(z.coerce.number().int().positive()));

/**
 * Enforce unique IDs
 */
const uniqueNumberArray = jsonNumberArrayBase.refine(
  (arr) => new Set(arr).size === arr.length,
  { message: "Duplicate IDs are not allowed" }
);

const uniqueNumberArrayOptional = uniqueNumberArray.optional();

/**
 * Description validation (strip HTML, limit length)
 */
const descriptionSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val) return true;
      const plainText = stripHtml(val);
      return plainText.length <= env.DESCRIPTION_LIMIT;
    },
    {
      message: `Description must be within ${env.DESCRIPTION_LIMIT} characters`,
    }
  );

/* =====================================================
   CREATE PACKAGE
===================================================== */

const createPackageSchema = z
  .object({
    title: z.string().min(1, "Package title is required"),

    days: z.coerce.number().int().min(2, "Package must be at least 2 days"),

    nights: z.coerce.number().int().min(1, "At least 1 night is required"),

    price: z.coerce.number().positive("Price must be greater than 0"),

    categoryIds: uniqueNumberArray.refine((v) => v.length > 0, {
      message: "At least one category is required",
    }),

    stateIds: uniqueNumberArray.refine((v) => v.length > 0, {
      message: "At least one state is required",
    }),

    locationIds: uniqueNumberArray.refine((v) => v.length > 0, {
      message: "At least one location is required",
    }),

    facilityIds: uniqueNumberArrayOptional,

    description: descriptionSchema,
  })
  .refine((data) => data.nights === data.days - 1, {
    path: ["nights"],
    message: "Nights must be exactly Days - 1",
  });

export const createPackageRequestSchema = z.object({
  body: createPackageSchema,
});

/* =====================================================
   GET ALL PACKAGES (QUERY FILTERS)
===================================================== */

/**
 * Handles query params like:
 * ?stateIds=1,2,3
 */
const numberArrayFromQuery = z
  .preprocess((val) => {
    if (typeof val === "string") {
      return val.split(",").map(Number);
    }
    if (Array.isArray(val)) {
      return val.map(Number);
    }
    return undefined;
  }, z.array(z.number().int().positive()).optional())
  .refine((arr) => !arr || new Set(arr).size === arr.length, {
    message: "Duplicate IDs are not allowed",
  });

const getAllPackagesQuerySchema = z.object({
  days: z.coerce.number().int().positive().optional(),
  nights: z.coerce.number().int().positive().optional(),

  stateIds: numberArrayFromQuery,
  locationIds: numberArrayFromQuery,
  categoryIds: numberArrayFromQuery,

  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),

  search: z.string().trim().min(1).optional(),

  sort: z.enum(["asc", "desc"]).optional(),

  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export const getPackagesRequestSchema = z.object({
  query: getAllPackagesQuerySchema,
});

/* =====================================================
   UPDATE PACKAGE
===================================================== */


const updatePackageSchema = z
  .object({
    title: z.string().trim().min(1).optional(),

    days: z.coerce.number().int().min(2).optional(),

    nights: z.coerce.number().int().min(1).optional(),

    price: z.coerce.number().positive().optional(),

    description: descriptionSchema,

    categoryIds: uniqueNumberArrayOptional,
    stateIds: uniqueNumberArrayOptional,
    locationIds: uniqueNumberArrayOptional,
    facilityIds: uniqueNumberArrayOptional,
  })
  .refine(
    (data) => {
      if (data.days !== undefined && data.nights !== undefined) {
        return data.nights === data.days - 1;
      }
      return true;
    },
    {
      message: "Nights must be exactly Days - 1",
      path: ["nights"],
    }
  );
export const updatePackageRequestSchema = z.object({
  body: updatePackageSchema,
});
