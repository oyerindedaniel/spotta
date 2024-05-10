import { cookies } from "next/headers";
import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import bcrypt from "bcryptjs";
import { addMinutes, isPast } from "date-fns";
import _ from "lodash";
import { v4 as uuid } from "uuid";
import { z } from "zod";

import { sendMail, SpottaEmailTemplate } from "@repo/email";
import { loginSchema } from "@repo/validations";

import {
  AUTH_DURATION,
  COOKIE_NAME,
  MAIN_SITE_URL,
  SESSION_COOKIE_NAME,
} from "../config";
import { generateAccessToken, generateRefreshToken } from "../lib";
import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    const { session } = ctx;
    return session?.user ?? null;
  }),
  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const { email, password } = input;
    const { db, userAgent } = ctx;

    const { os, browser } = userAgent || {};

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

    const passwordMatch = await bcrypt.compare(password, user?.password ?? "");

    if (!passwordMatch) {
      throw error;
    }

    if (!user.isConfirmed) {
      const token = uuid();

      const verificationLink = `${MAIN_SITE_URL}/verify-email?token=${token}`;

      await db.verificationToken.create({
        data: {
          user: { connect: { id: user.id } },
          token,
          expires: addMinutes(new Date(), 30),
        },
      });

      await sendMail({
        email,
        subject: "Spotta Email Verfication",
        html: SpottaEmailTemplate({
          verificationLink,
        }),
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const session = await db.session.create({
      data: {
        user: { connect: { id: user.id } },
        os: os?.name ?? "",
        browser: browser?.name ?? "",
        refreshTokens: {
          create: {
            token: refreshToken,
            expires: addMinutes(new Date(), Number(AUTH_DURATION) * 2),
          },
        },
      },
    });

    const currentDate = new Date();

    cookies().set({
      name: COOKIE_NAME,
      value: accessToken,
      httpOnly: true,
      sameSite: "lax",
      expires: addMinutes(currentDate, Number(AUTH_DURATION)),
    });

    cookies().set({
      name: SESSION_COOKIE_NAME,
      value: session.id,
      httpOnly: true,
      sameSite: "lax",
      expires: addMinutes(currentDate, Number(AUTH_DURATION) * 2),
    });

    return {
      data: {
        ..._.omit(user, ["password"]),
        refreshToken,
        sessionId: session.id,
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

      const { db, session: user } = ctx;

      const error = new TRPCError({ code: "UNAUTHORIZED" });

      const refreshToken = await db.refreshToken.findUnique({
        where: {
          token,
        },
        include: { session: true },
      });

      if (!refreshToken) {
        throw error;
      }

      const session = refreshToken.session;

      if (session.invalidatedAt) {
        throw error;
      }

      if (isPast(refreshToken.expires)) {
        await db.session.update({
          where: {
            id: session.id,
          },
          data: { invalidatedAt: new Date() },
        });

        throw error;
      }

      const newRefreshToken = generateRefreshToken(user.user);
      const newAccessToken = generateAccessToken(user.user);

      await db.refreshToken.create({
        data: {
          session: { connect: { id: session.id } },
          token: newRefreshToken,
          expires: addMinutes(new Date(), Number(AUTH_DURATION) * 2),
        },
      });

      await db.refreshToken.update({
        where: {
          id: refreshToken.id,
        },
        data: {
          expires: new Date(),
        },
      });

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
  logout: protectedProcedure
    .input(
      z.object({
        refreshToken: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { refreshToken: token } = input;

      const { db } = ctx;

      const error = new TRPCError({ code: "UNAUTHORIZED" });

      const refreshToken = await db.refreshToken.findUnique({
        where: {
          token,
        },
        include: { session: true },
      });

      if (!refreshToken) {
        throw error;
      }

      const session = refreshToken.session;

      await db.session.update({
        where: {
          id: session.id,
        },
        data: { invalidatedAt: new Date() },
      });

      cookies().delete(COOKIE_NAME);

      return {
        data: true,
      };
    }),
} satisfies TRPCRouterRecord;
