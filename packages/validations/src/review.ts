import { ReactionType, ReviewStatus } from "@prisma/client";
import { z } from "zod";

import { updateAmenitySchema } from "./amenity";

const reviewSchema = z.object({
  rating: z.string().trim().min(1, { message: "Rating is required" }),
  asAnonymous: z.boolean().default(false),
  amenities: z.array(updateAmenitySchema).min(1, "Select at least one amenity"),
  description: z.string().min(1, { message: "Descripiton is required" }),
  areaId: z.string().trim().min(1, { message: "Area is required" }),
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

const updateReviewReactionSchema = z.object({
  id: z.string().trim().min(1, { message: "Required" }),
  type: z.union([
    z.literal(ReactionType.LIKE),
    z.literal(ReactionType.DISLIKE),
    z.literal("UNLIKE"),
    z.literal("UNDISLIKE"),
  ]),
});

const updateReviewLikeReactionSchema = z.object({
  id: z.string().trim().min(1, { message: "Required" }),
  type: z.literal(ReactionType.LIKE),
});

const updateReviewDislikeReactionSchema = z.object({
  id: z.string().trim().min(1, { message: "Required" }),
  type: z.literal(ReactionType.DISLIKE),
});

const updateReviewUnlikeReactionSchema = z.object({
  id: z.string().trim().min(1, { message: "Required" }),
  type: z.union([z.literal("UNLIKE"), z.literal("UNDISLIKE")]),
});

export {
  createReviewSchema,
  updateReviewDislikeReactionSchema,
  updateReviewLikeReactionSchema,
  updateReviewReactionSchema,
  updateReviewSchema,
  updateReviewStatusSchema,
  updateReviewUnlikeReactionSchema,
};
