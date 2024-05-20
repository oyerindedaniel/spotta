import { z } from "zod";

const createAmenitySchema = z.object({
  name: z.string(),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export { createAmenitySchema };
