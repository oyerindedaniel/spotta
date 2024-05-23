import { z } from "zod";

import { updateAmenitySchema } from "./amenity";

const createReviewSchema = z.object({
  rating: z.string(),
  asAnonymous: z.boolean().default(false),
  amenities: z.array(updateAmenitySchema),
  description: z.string(),
  areaId: z.string(),
});

export { createReviewSchema };
