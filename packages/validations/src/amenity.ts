import { z } from "zod";

const amenitySchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  category: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .refine((val) => val !== null && val !== undefined, {
      message: "Category is required",
    }),
});

const createAmenitySchema = amenitySchema.extend({});

const updateAmenitySchema = amenitySchema.extend({
  id: z.string(),
});

export { createAmenitySchema, updateAmenitySchema };
