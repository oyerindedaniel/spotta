import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return "live";
  }),
  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can see this secret message!";
  // }),
} satisfies TRPCRouterRecord;
