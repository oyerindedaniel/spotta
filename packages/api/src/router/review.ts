import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import {
  createReviewSchema,
  updateReviewReactionSchema,
  updateReviewSchema,
  updateReviewStatusSchema,
} from "@repo/validations";

import { adminProtectedProcedure, protectedProcedure } from "../trpc";

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
  reviewReaction: protectedProcedure
    .input(updateReviewReactionSchema)
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;

      const { id: userId } = session.user;

      const { id: reviewId, type } = input;

      const successData = {
        data: true,
      };

      const foundReaction = await db.reviewReaction.findFirst({
        where: {
          user: { id: userId },
          OR: [
            {
              likeReview: { id: reviewId },
              type: "LIKE",
            },
            {
              dislikeReview: { id: reviewId },
              type: "DISLIKE",
            },
          ],
        },
        include: {
          user: true,
          likeReview: true,
          dislikeReview: true,
        },
      });

      if (type === "UNLIKE" && foundReaction?.type === "LIKE") {
        await db.reviewReaction.delete({
          where: {
            userId_likeReviewId: {
              userId,
              likeReviewId: foundReaction.likeReviewId!,
            },
          },
        });
        return successData;
      } else if (type === "UNDISLIKE" && foundReaction?.type === "DISLIKE") {
        await db.reviewReaction.delete({
          where: {
            userId_dislikeReviewId: {
              userId,
              dislikeReviewId: foundReaction.dislikeReviewId!,
            },
          },
        });
        return successData;
      } else if (foundReaction) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You have already ${foundReaction.type.toLowerCase()}d this review.`,
        });
      }

      const reactionData = {
        userId,
        type: type as "LIKE" | "DISLIKE",
      };

      if (type === "LIKE") {
        //@ts-ignore
        reactionData.likeReviewId = reviewId;
      } else if (type === "DISLIKE") {
        //@ts-ignore
        reactionData.dislikeReviewId = reviewId;
      }

      await db.reviewReaction.create({
        data: reactionData,
      });

      return successData;
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
