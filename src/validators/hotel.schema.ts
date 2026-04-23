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
   CREATE HOTEL
===================================================== */

const createHotelSchema = z.object({
  name: z.string().trim().min(1, "Hotel name is required"),

  stateId: z.coerce.number().int().positive("State is required"),

  locationId: z.coerce.number().int().positive("Location is required"),

  price: z.coerce.number().positive("Price must be greater than 0"),

  description: descriptionSchema,

  categoryIds: uniqueNumberArray.refine((v) => v.length > 0, {
    message: "At least one category is required",
  }),
  facilityIds: uniqueNumberArrayOptional,
});

export const createHotelRequestSchema = z.object({
  body: createHotelSchema,
});

/* =====================================================
   GET ALL HOTELS (QUERY FILTERS)
===================================================== */

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

const getAllHotelsQuerySchema = z.object({
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

export const getHotelsRequestSchema = z.object({
  query: getAllHotelsQuerySchema,
});

/* =====================================================
   UPDATE HOTEL
===================================================== */

const updateHotelSchema = z.object({
  name: z.string().trim().min(1).optional(),

  stateId: z.coerce.number().int().positive().optional(),

  locationId: z.coerce.number().int().positive().optional(),

  price: z.coerce.number().positive().optional(),

  description: descriptionSchema,

  categoryIds: uniqueNumberArrayOptional,
  facilityIds: uniqueNumberArrayOptional,
});

export const updateHotelRequestSchema = z.object({
  body: updateHotelSchema,
});
