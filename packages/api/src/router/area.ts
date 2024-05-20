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
      const { name, state, lga, latitude, longitude, medias, address } = input;

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
          address,
          latitude,
          longitude,
          createdBy: { connect: { id: userId } },
          medias: {
            create: medias.map((medias, idx) => ({
              src: medias[idx]!,
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
