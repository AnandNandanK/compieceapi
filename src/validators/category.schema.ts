import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1, "Required field:[name]"),
});

const updateCategoryBodySchema = z.object({
  name: z.string().min(1, "Required field:[name]"),
});
const updateCategoryParamsSchema = z.object({
  id: z.coerce.number().int().positive("Invalid category id"),
});
export const createCategoryRequestSchema = z.object({
  body: createCategorySchema,
});

export const updateCategoryRequestSchema = z.object({
  body: updateCategoryBodySchema,
  params: updateCategoryParamsSchema,
});
export const updateCategoryStatusRequestSchema = z.object({
  params: updateCategoryParamsSchema,
});
