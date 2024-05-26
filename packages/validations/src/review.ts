import { ReviewStatus } from "@prisma/client";
import { z } from "zod";

import { updateAmenitySchema } from "./amenity";

const createReviewSchema = z.object({
  rating: z.string(),
  asAnonymous: z.boolean().default(false),
  amenities: z.array(updateAmenitySchema),
  description: z.string(),
  areaId: z.string(),
});

const updateReviewStatusSchema = z.object({
  id: z.string(),
  status: z.union([
    z.literal(ReviewStatus.APPROVED),
    z.literal(ReviewStatus.DECLINED),
    z.literal(ReviewStatus.PENDING),
  ]),
});

export { createReviewSchema, updateReviewStatusSchema };
