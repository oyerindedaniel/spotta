import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = {
  createUser: protectedProcedure.query(({ ctx }) => {
    return "new user";
  }),
} satisfies TRPCRouterRecord;
