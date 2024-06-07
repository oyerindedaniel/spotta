import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import {
  createReviewCommentSchema,
  createReviewSchema,
  updateReviewDislikeReactionSchema,
  updateReviewLikeReactionSchema,
  updateReviewReactionSchema,
  updateReviewSchema,
  updateReviewStatusSchema,
  updateReviewUnlikeReactionSchema,
} from "@repo/validations";

import {
  adminProtectedProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

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
  createComment: protectedProcedure
    .input(createReviewCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { id: userId } = session.user;
      const { reviewId, comment } = input;

      const createdReviewComment = await db.reviewComment.create({
        data: {
          comment,
          review: { connect: { id: reviewId } },
          user: { connect: { id: userId } },
        },
      });

      return {
        data: createdReviewComment,
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

      const currentReview = await db.review.findUnique({
        where: { id: reviewId },
        select: {
          amenities: true,
        },
      });

      if (!currentReview) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Review does not exist",
        });
      }

      const currentAmenityIds = currentReview.amenities.map((amenity) => ({
        id: amenity.id,
      }));

      await db.review.update({
        where: { id: reviewId },
        data: {
          area: { connect: { id: areaId } },
          description,
          rating: Number(rating),
          asAnonymous,
          amenities: {
            disconnect: currentAmenityIds,
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
        where: { id: reviewId },
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
  delete: protectedProcedure
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
  findById: publicProcedure
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
          likeReactions: true,
          dislikeReactions: true,
          comments: true,
          amenities: {
            include: { category: true },
          },
          _count: {
            select: {
              likeReactions: true,
              dislikeReactions: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!review) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Review not available",
        });
      }

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
      });

      const deleteReaction = async (reactionType: "LIKE" | "DISLIKE") => {
        const whereClause =
          reactionType === "LIKE"
            ? {
                userId_likeReviewId: {
                  userId,
                  likeReviewId: foundReaction!.likeReviewId!,
                },
              }
            : {
                userId_dislikeReviewId: {
                  userId,
                  dislikeReviewId: foundReaction!.dislikeReviewId!,
                },
              };

        await db.reviewReaction.delete({ where: whereClause });
      };

      const createReaction = async (newType: "LIKE" | "DISLIKE") => {
        const data =
          newType === "LIKE"
            ? { userId, type: newType, likeReviewId: reviewId }
            : { userId, type: newType, dislikeReviewId: reviewId };

        await db.reviewReaction.create({ data });
      };

      if (type === "UNLIKE" && foundReaction?.type === "LIKE") {
        await deleteReaction("LIKE");
        return successData;
      } else if (type === "UNDISLIKE" && foundReaction?.type === "DISLIKE") {
        await deleteReaction("DISLIKE");
        return successData;
      } else if (type === "LIKE" && foundReaction?.type === "DISLIKE") {
        await deleteReaction("DISLIKE");
        await createReaction("LIKE");
        return successData;
      } else if (type === "DISLIKE" && foundReaction?.type === "LIKE") {
        await deleteReaction("LIKE");
        await createReaction("DISLIKE");
        return successData;
      } else if (foundReaction) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You have already ${foundReaction.type.toLowerCase()}d this review.`,
        });
      }

      // If no reaction is found and it's a new like or dislike
      await createReaction(type as "LIKE" | "DISLIKE");
      return successData;
    }),
  reviewLikeReaction: protectedProcedure
    .input(updateReviewLikeReactionSchema)
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;

      const { id: userId } = session.user;

      const { id: reviewId, type } = input;

      const successData = {
        data: type,
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
      });

      const deleteReaction = async (reactionType: "LIKE" | "DISLIKE") => {
        const whereClause =
          reactionType === "LIKE"
            ? {
                userId_likeReviewId: {
                  userId,
                  likeReviewId: foundReaction!.likeReviewId!,
                },
              }
            : {
                userId_dislikeReviewId: {
                  userId,
                  dislikeReviewId: foundReaction!.dislikeReviewId!,
                },
              };

        await db.reviewReaction.delete({ where: whereClause });
      };

      const createReaction = async (newType: "LIKE" | "DISLIKE") => {
        const data =
          newType === "LIKE"
            ? { userId, type: newType, likeReviewId: reviewId }
            : { userId, type: newType, dislikeReviewId: reviewId };

        await db.reviewReaction.create({ data });
      };

      if (type === "LIKE" && foundReaction?.type === "DISLIKE") {
        await deleteReaction("DISLIKE");
        await createReaction("LIKE");
        return successData;
      } else if (foundReaction) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You have already ${foundReaction.type.toLowerCase()}d this review.`,
        });
      }

      // If no reaction is found and it's a new like
      await createReaction(type);
      return successData;
    }),
  reviewDislikeReaction: protectedProcedure
    .input(updateReviewDislikeReactionSchema)
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;

      const { id: userId } = session.user;

      const { id: reviewId, type } = input;

      const successData = {
        data: type,
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
      });

      const deleteReaction = async (reactionType: "LIKE" | "DISLIKE") => {
        const whereClause =
          reactionType === "LIKE"
            ? {
                userId_likeReviewId: {
                  userId,
                  likeReviewId: foundReaction!.likeReviewId!,
                },
              }
            : {
                userId_dislikeReviewId: {
                  userId,
                  dislikeReviewId: foundReaction!.dislikeReviewId!,
                },
              };

        await db.reviewReaction.delete({ where: whereClause });
      };

      const createReaction = async (newType: "LIKE" | "DISLIKE") => {
        const data =
          newType === "LIKE"
            ? { userId, type: newType, likeReviewId: reviewId }
            : { userId, type: newType, dislikeReviewId: reviewId };

        await db.reviewReaction.create({ data });
      };

      if (type === "DISLIKE" && foundReaction?.type === "LIKE") {
        await deleteReaction("LIKE");
        await createReaction("DISLIKE");
        return successData;
      } else if (foundReaction) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You have already ${foundReaction.type.toLowerCase()}d this review.`,
        });
      }

      // If no reaction is found and it's a new like or dislike
      await createReaction(type as "LIKE" | "DISLIKE");
      return successData;
    }),
  reviewUnlikeReaction: protectedProcedure
    .input(updateReviewUnlikeReactionSchema)
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;

      const { id: userId } = session.user;

      const { id: reviewId, type } = input;

      const successData = {
        data: type,
      };

      const foundReaction = await db.reviewReaction.findFirst({
        where: {
          userId: userId,
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
      });

      const deleteReaction = async (reactionType: "LIKE" | "DISLIKE") => {
        const whereClause =
          reactionType === "LIKE"
            ? {
                userId_likeReviewId: {
                  userId,
                  likeReviewId: foundReaction!.likeReviewId!,
                },
              }
            : {
                userId_dislikeReviewId: {
                  userId,
                  dislikeReviewId: foundReaction!.dislikeReviewId!,
                },
              };

        await db.reviewReaction.delete({ where: whereClause });
      };

      if (type === "UNLIKE" && foundReaction?.type === "LIKE") {
        await deleteReaction("LIKE");
        return successData;
      } else if (type === "UNDISLIKE" && foundReaction?.type === "DISLIKE") {
        await deleteReaction("DISLIKE");
        return successData;
      } else if (foundReaction) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You have already ${foundReaction.type.toLowerCase()}d this review.`,
        });
      }
      return successData;
    }),
  findByCommentId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const { id: commentId } = input;

      const comment = await db.reviewComment.findFirst({
        where: { id: commentId },
        include: {
          user: true,
          review: true,
          replies: true,
          likeReactions: true,
          dislikeReactions: true,
          _count: {
            select: {
              likeReactions: true,
              dislikeReactions: true,
              replies: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!comment) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Comment not available",
        });
      }

      return {
        data: comment,
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
