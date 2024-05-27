import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { createAmenitySchema, updateAmenitySchema } from "@repo/validations";

import { adminProtectedProcedure } from "../trpc";

export const amenityRouter = {
  create: adminProtectedProcedure
    .input(createAmenitySchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { id: userId } = session.user;
      const {
        name,
        category: { id: categoryId, name: catergoryName },
      } = input;

      const createdAmenity = await db.amenity.create({
        data: {
          name,
          createdBy: { connect: { id: userId } },
          category: {
            connectOrCreate: {
              where: { id: categoryId },
              create: {
                name: catergoryName,
                createdBy: { connect: { id: userId } },
              },
            },
          },
        },
      });

      return {
        data: createdAmenity,
      };
    }),
  update: adminProtectedProcedure
    .input(updateAmenitySchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { id: userId } = session.user;
      const {
        id: amenityId,
        name,
        category: { id: categoryId, name: catergoryName },
      } = input;

      await db.amenity.update({
        where: {
          id: amenityId,
          createdBy: { id: userId },
        },
        data: {
          name,
          category: {
            connect: { id: categoryId },
          },
        },
      });

      return {
        data: true,
      };
    }),
  findAllCatergory: adminProtectedProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    const categories = await db.amenityCategory.findMany({});

    return {
      data: categories,
    };
  }),
  findAll: adminProtectedProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    const amenities = await db.amenity.findMany({
      include: {
        category: true,
        createdBy: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data: amenities,
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

      const { id: amenityId } = input;

      const amenity = await db.amenity.findFirst({
        where: { id: amenityId },
        include: {
          category: true,
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      });

      return {
        data: amenity,
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
      const { id: amenityId } = input;

      const { id: userId } = session.user;

      await db.amenity.delete({
        where: { id: amenityId, createdBy: { id: userId } },
      });

      return {
        data: true,
      };
    }),
  find: adminProtectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;

    const { id } = session.user;

    const amenities = await db.amenity.findMany({
      include: {
        category: true,
        reviews: true,
      },
    });
    return {
      data: amenities,
    };
  }),
} satisfies TRPCRouterRecord;
