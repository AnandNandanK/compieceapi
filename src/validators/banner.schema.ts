import { z } from "zod";

export const createBannerSchema = z.object({
  stateId: z
    .union([z.string(), z.number()])
    .refine((val) => Number(val) > 0, {
      message: "State is required",
    }),

  title: z
    .string()
    .min(1, "Title is required")
    .optional(), // keep optional if your DB allows it
});

export const createBannerRequestSchema = z.object({
  body: createBannerSchema,
});
