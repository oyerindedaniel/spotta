import { TRPCError, TRPCRouterRecord } from "@trpc/server";

import { adminProtectedProcedure } from "../trpc";

export const activityRouter = {
  getActivity: adminProtectedProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    try {
      const [areaCount, reviewCount, userCount] = await Promise.all([
        db.area.count(),
        db.review.count(),
        db.user.count(),
      ]);

      return {
        data: {
          areaCount,
          reviewCount,
          userCount,
        },
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve counts",
        // cause: error,
      });
    }
  }),
} satisfies TRPCRouterRecord;
