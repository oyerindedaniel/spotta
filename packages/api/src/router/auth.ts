import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../trpc.js";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx;
  }),
  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can see this secret message!";
  // }),
} satisfies TRPCRouterRecord;
