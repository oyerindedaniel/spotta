import { TRPCRouterRecord } from "@trpc/server";

import { createAreaSchema } from "@repo/validations";

import { protectedProcedure } from "../trpc";
import { generateUniqueSlug } from "../utils";

export const areaRouter = {
  create: protectedProcedure
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
          address: "Plot 13b",
          latitude: latitude?.toString() ?? "2.2",
          longitude: longitude?.toString() ?? "1.1",
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
} satisfies TRPCRouterRecord;
