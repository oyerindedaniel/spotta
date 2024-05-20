import { TRPCRouterRecord } from "@trpc/server";

import { createAmenitySchema } from "@repo/validations";

import { protectedProcedure } from "../trpc";

export const amenityRouter = {
  create: protectedProcedure
    .input(createAmenitySchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { id: userId } = session.user;
      const {
        name,
        category: { id, name: catergoryName },
      } = input;

      const createdAmenity = await db.amenity.create({
        data: {
          name,
          user: { connect: { id: userId, role: { in: ["ADMIN"] } } },
          category: {
            connectOrCreate: {
              where: { id },
              create: {
                name: catergoryName,
              },
            },
          },
        },
      });

      return {
        data: createdAmenity,
      };
    }),
  find: protectedProcedure.query(async ({ ctx }) => {
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
