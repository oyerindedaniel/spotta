import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

import { loginSchema } from "@repo/validations";

import { publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return "live fuck u";
  }),
  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const { email, password } = input;
    const { db } = ctx;

    const error = new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid credentials",
    });

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw error;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw error;
    }

    return {
      data: {},
    };
  }),
} satisfies TRPCRouterRecord;
