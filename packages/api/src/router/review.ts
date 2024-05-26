import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import {
  createReviewSchema,
  updateReviewSchema,
  updateReviewStatusSchema,
} from "@repo/validations";

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
  updateAdmin: adminProtectedProcedure
    .input(updateReviewSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const { id: userId } = session.user;

      const {
        id: reviewId,
        description,
        asAnonymous,
        amenities,
        rating,
        areaId,
      } = input;

      await db.review.update({
        where: { id: reviewId, createdBy: { id: userId } },
        data: {
          area: { connect: { id: areaId } },
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
        data: true,
      };
    }),
  updateStatus: adminProtectedProcedure
    .input(updateReviewStatusSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const { id: userId } = session.user;

      const { id: reviewId, status } = input;

      await db.review.update({
        where: { id: reviewId, createdBy: { id: userId } },
        data: {
          status,
        },
      });

      return {
        data: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data: reviews,
    };
  }),
  delete: adminProtectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { id: reviewId } = input;

      const { id: userId } = session.user;

      await db.review.delete({
        where: { id: reviewId, createdBy: { id: userId } },
      });

      return {
        data: true,
      };
    }),
  findById: adminProtectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const { id: reviewId } = input;

      const review = await db.review.findFirst({
        where: { id: reviewId },
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
        data: review,
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
