import { z } from "zod";

const createAmenitySchema = z.object({
  name: z.string(),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

const updateAmenitySchema = createAmenitySchema.extend({
  id: z.string(),
});

export { createAmenitySchema, updateAmenitySchema };
