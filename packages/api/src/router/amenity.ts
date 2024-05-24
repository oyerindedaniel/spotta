import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { createAmenitySchema } from "@repo/validations";

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
