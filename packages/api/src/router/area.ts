import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { createAreaSchema, updateAreaSchema } from "@repo/validations";

import { adminProtectedProcedure, publicProcedure } from "../trpc";
import { generateUniqueSlug } from "../utils";

export const areaRouter = {
  create: adminProtectedProcedure
    .input(createAreaSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { id: userId } = session.user;
      const { name, state, lga, medias, coordinates } = input;

      const { latitude, longitude, address } = coordinates ?? {};

      const mediasToString = medias as Array<string>;

      const isSlugUnique = async (slug: string) => {
        const result = await ctx.db.area.findFirst({ where: { slug } });
        return !!result;
      };

      const slug = await generateUniqueSlug(name, isSlugUnique);

      const createdArea = await db.area.create({
        data: {
          name,
          slug,
          state,
          lga,
          address: address || "Plot 13b",
          latitude: latitude || 2.2,
          longitude: longitude || 1.1,
          createdBy: { connect: { id: userId } },
          medias: {
            create: mediasToString.map((media) => ({
              src: media,
              user: { connect: { id: userId } },
            })),
          },
        },
      });

      return {
        data: createdArea,
      };
    }),
  update: adminProtectedProcedure
    .input(updateAreaSchema)
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;

      const { id: userId } = session.user;

      const {
        id: areaId,
        name,
        state,
        lga,
        medias,
        coordinates,
        deletedMedias,
      } = input;

      const { latitude, longitude, address } = coordinates ?? {};

      const mediasToString = medias.filter(Boolean) as Array<string>;

      const updatedArea = await db.area.update({
        where: { id: areaId },
        data: {
          name,
          state,
          lga,
          address: address || "Plot 13b",
          latitude: latitude || 2.2,
          longitude: longitude || 1.1,
          medias: {
            ...(mediasToString.length > 0 && {
              create: mediasToString.map((media) => ({
                src: media,
                user: { connect: { id: userId } },
              })),
            }),
            ...(deletedMedias.length > 0 && {
              deleteMany: {
                id: {
                  in: deletedMedias.map((media) => media.id),
                },
              },
            }),
          },
        },
      });

      return {
        data: updatedArea,
      };
    }),
  delete: adminProtectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id: areaId } = input;

      await db.area.delete({
        where: { id: areaId },
      });

      return {
        data: true,
      };
    }),
  findAll: adminProtectedProcedure.query(async ({ ctx, input }) => {
    const { db } = ctx;

    const areas = await db.area.findMany({
      include: {
        createdBy: true,
        medias: true,
        reviews: {
          include: { _count: { select: { amenities: true } }, amenities: true },
        },
        _count: {
          select: {
            reviews: true,
            medias: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data: areas,
    };
  }),
  findAllNoInclude: adminProtectedProcedure.query(async ({ ctx, input }) => {
    const { db } = ctx;

    const areas = await db.area.findMany({});

    return {
      data: areas,
    };
  }),
  findAllHomeSearch: publicProcedure.query(async ({ ctx, input }) => {
    const { db } = ctx;

    const areas = await db.area.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return {
      data: areas,
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

      const { id: areaId } = input;

      const area = await db.area.findFirst({
        where: { id: areaId },
        include: {
          createdBy: true,
          medias: true,
          reviews: {
            include: {
              createdBy: true,
              likeReactions: true,
              dislikeReactions: true,
              comments: true,
              amenities: { include: { category: true } },
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
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!area) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Area not available",
        });
      }

      return {
        data: area,
      };
    }),
  findBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const { slug } = input;

      const initialLimit = 10;
      const initialSkip = 0;

      const amenities = await db.amenity.findMany({});

      const area = await db.area.findFirst({
        where: { slug },
        include: {
          medias: true,
          reviews: {
            take: initialLimit,
            skip: initialSkip,
            cursor: undefined,
            include: {
              amenities: { include: { category: true } },
              createdBy: true,
              likeReactions: true,
              dislikeReactions: true,
              comments: true,
              _count: {
                select: {
                  likeReactions: true,
                  dislikeReactions: true,
                  comments: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          _count: {
            select: { reviews: true },
          },
        },
      });

      if (!area) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Area does not exist",
        });
      }

      return {
        data: { area, amenities },
      };
    }),
  groupAmenityByAreaId: adminProtectedProcedure
    .input(
      z.object({
        areaId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const { areaId } = input;

      /**
       * There's no direct existing relationship between area and amenity.
       * In this scenario, the groupBy and count method would have been used to group and get count amenities.
       */

      const foundArea = await db.area.findFirst({
        where: { id: areaId },
        include: {
          reviews: {
            include: {
              amenities: true,
            },
          },
        },
      });

      if (!foundArea) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Area not available",
        });
      }

      const groupedAmenities = {} as Record<string, number>;

      foundArea.reviews.forEach((review) => {
        review.amenities.forEach((amenity) => {
          const { name } = amenity;
          //@ts-ignore
          groupedAmenities[name] = (groupedAmenities[name] || 0) + 1;
        });
      });

      return {
        data: groupedAmenities,
      };
    }),
} satisfies TRPCRouterRecord;
