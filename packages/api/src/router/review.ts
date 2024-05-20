import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { createReviewSchema } from "@repo/validations";

import { protectedProcedure } from "../trpc";

export const reviewRouter = {
  create: protectedProcedure
    .input(createReviewSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { id: userId } = session.user;
      const { amenities, description, rating, asAnonymous, areaId } = input;

      const createdReview = await db.review.create({
        data: {
          area: { connect: { id: areaId } },
          description,
          rating: Number(rating),
          asAnonymous,
          amenities: {
            create: amenities.map((amenity) => ({
              name: amenity.name,
              user: { connect: { id: userId } },
            })),
          },
        },
      });

      return {
        data: createdReview,
      };
    }),
  findBy: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const { id: reviewId } = input;

      const { id: userId } = session.user;

      db.review.findMany({ where: { id: reviewId } });

      return {
        data: true,
      };
    }),
} satisfies TRPCRouterRecord;
