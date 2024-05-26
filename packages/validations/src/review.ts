import { ReviewStatus } from "@prisma/client";
import { z } from "zod";

import { updateAmenitySchema } from "./amenity";

const reviewSchema = z.object({
  rating: z.string(),
  asAnonymous: z.boolean().default(false),
  amenities: z.array(updateAmenitySchema),
  description: z.string(),
  areaId: z.string(),
});

const createReviewSchema = reviewSchema.extend({});

const updateReviewSchema = reviewSchema.extend({
  id: z.string(),
});

const updateReviewStatusSchema = z.object({
  id: z.string(),
  status: z.union([
    z.literal(ReviewStatus.APPROVED),
    z.literal(ReviewStatus.DECLINED),
    z.literal(ReviewStatus.PENDING),
  ]),
});

export { createReviewSchema, updateReviewStatusSchema, updateReviewSchema };
