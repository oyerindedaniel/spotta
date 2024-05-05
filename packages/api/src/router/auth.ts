import type { TRPCRouterRecord } from "@trpc/server";
import { cookies } from "next/headers";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { addMinutes, isPast } from "date-fns";
import _ from "lodash";
import { z } from "zod";

import { loginSchema } from "@repo/validations";

import { AUTH_DURATION, COOKIE_NAME } from "../config";
import { generateAccessToken, generateRefreshToken } from "../lib/token";
import { protectedProcedure, publicProcedure } from "../trpc";

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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const session = await db.session.create({
      data: {
        user: { connect: { id: user.id } },
        refreshTokens: {
          create: {
            token: refreshToken,
            expires: addMinutes(new Date(), Number(AUTH_DURATION)),
          },
        },
      },
    });

    if (!session) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred",
      });
    }

    const currentDate = new Date();
    cookies().set({
      name: COOKIE_NAME,
      value: accessToken,
      httpOnly: true,
      sameSite: "lax",
      expires: addMinutes(currentDate, Number(AUTH_DURATION)),
    });

    return {
      data: {
        ..._.omit(user, ["password"]),
        refreshToken,
      },
    };
  }),
  refresh: protectedProcedure
    .input(
      z.object({
        refreshToken: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { refreshToken: token } = input;

      const { db } = ctx;

      const error = new TRPCError({ code: "UNAUTHORIZED" });

      const refreshToken = await db.refreshToken.findUnique({
        where: {
          token,
        },
      });

      if (!refreshToken) {
        throw error;
      }

      const session = await db.session.findFirst({
        where: {
          refreshTokens: {
            some: {
              token,
            },
          },
        },
        include: {
          user: true,
        },
      });

      if (!session) {
        throw error;
      }

      if (isPast(refreshToken.expires)) {
        await db.session.update({
          where: {
            id: session.id,
          },
          data: { invalidatedAt: new Date() },
          include: {
            user: true,
          },
        });

        throw error;
      }

      const newRefreshToken = generateRefreshToken(session.user);
      const newAccessToken = generateAccessToken(session.user);

      const currentDate = new Date();
      cookies().set({
        name: COOKIE_NAME,
        value: newAccessToken,
        httpOnly: true,
        sameSite: "lax",
        expires: addMinutes(currentDate, Number(AUTH_DURATION)),
      });

      return {
        data: {
          refreshToken: newRefreshToken,
        },
      };
    }),
} satisfies TRPCRouterRecord;
