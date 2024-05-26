import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { createReviewSchema } from "@repo/validations";

import { adminProtectedProcedure } from "../trpc";

export const reviewRouter = {
  create: adminProtectedProcedure
    .input(createReviewSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { id: userId } = session.user;
      const { amenities, description, rating, asAnonymous, areaId } = input;

      const createdReview = await db.review.create({
        data: {
          area: { connect: { id: areaId } },
          createdBy: { connect: { id: userId } },
          description,
          rating: Number(rating),
          asAnonymous,
          amenities: {
            connect: amenities.map((amenity) => ({
              id: amenity.id,
            })),
          },
        },
      });

      return {
        data: createdReview,
      };
    }),
  findAll: adminProtectedProcedure.query(async ({ ctx, input }) => {
    const { db } = ctx;

    const reviews = await db.review.findMany({
      include: {
        area: true,
        createdBy: true,
        amenities: {
          include: { category: true },
        },
        _count: {
          select: {
            likeReactions: true,
            dislikeReactions: true,
          },
        },
      },
    });

    return {
      data: reviews,
    };
  }),
  findBy: adminProtectedProcedure
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
