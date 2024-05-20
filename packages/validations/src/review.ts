import { z } from "zod";

import { createAmenitySchema } from "./amenity";

const createReviewSchema = z.object({
  rating: z.string(),
  asAnonymous: z.boolean().default(false),
  amenities: z.array(createAmenitySchema),
  description: z.string(),
  areaId: z.string(),
});

export { createReviewSchema };
