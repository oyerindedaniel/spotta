import { cookies } from "next/headers";
import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import bcrypt from "bcryptjs";
import { addMinutes, isPast } from "date-fns";
import _ from "lodash";
import { v4 as uuid } from "uuid";
import { z } from "zod";

import { sendMail, SpottaEmailTemplate } from "@repo/email";
import { type RefreshTokenRedisObj } from "@repo/types";
import { loginSchema } from "@repo/validations";

import {
  AUTH_DURATION,
  COOKIE_CONFIG,
  COOKIE_NAME,
  MAIN_SITE_URL,
  REDIS_SESSION_DEFAULT_EXPIRE,
} from "../config";
import { redis } from "../config/redis";
import { generateAccessToken, generateRefreshToken } from "../lib";
import { verifyRefreshToken } from "../middleware/auth";
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

    const session = await db.session.create({
      data: {
        user: { connect: { id: user.id } },
        os: os?.name ?? "",
        browser: browser?.name ?? "",
      },
    });

    const currentDate = new Date();

    const accessToken = generateAccessToken({ user, session });
    const refreshToken = generateRefreshToken({ session });

    const refreshTokens = [];

    const refreshTokenSchema = {
      token: refreshToken,
      expires: addMinutes(currentDate, Number(AUTH_DURATION)),
      userId: user.id,
    };

    refreshTokens.push(refreshTokenSchema);

    await redis.setex(
      session.id,
      REDIS_SESSION_DEFAULT_EXPIRE,
      JSON.stringify(refreshTokens),
    );

    cookies().set({
      name: COOKIE_NAME,
      value: accessToken,
      expires: addMinutes(currentDate, Number(AUTH_DURATION)),
      ...COOKIE_CONFIG,
    });

    return {
      data: {
        ..._.omit(user, ["password"]),
        refreshToken,
        sessionId: session.id,
      },
    };
  }),
  refreshToken: protectedProcedure
    .input(
      z.object({
        refreshToken: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { refreshToken: token } = input;

      const { db, session: activeUserSession } = ctx;

      const { sessionId } = activeUserSession.user;

      const error = new TRPCError({ code: "UNAUTHORIZED" });

      const session = await verifyRefreshToken(token);

      if (!session) throw error;

      if (session.id !== sessionId) throw error;

      const refreshTokens = (await redis.get(
        sessionId,
      )) as Array<RefreshTokenRedisObj>;

      const foundToken = refreshTokens.find(
        (refreshToken) => refreshToken.token === token,
      );

      if (!foundToken) {
        throw error;
      }

      if (session.invalidatedAt) {
        throw error;
      }

      if (isPast(new Date(foundToken.expires))) {
        await db.session.update({
          where: {
            id: session.id,
          },
          data: { invalidatedAt: new Date() },
        });

        throw error;
      }

      const newRefreshToken = generateRefreshToken({ session });
      const newAccessToken = generateAccessToken({
        user: activeUserSession.user,
        session,
      });

      const currentDate = new Date();

      const refreshTokenSchema = {
        token: newRefreshToken,
        expires: addMinutes(currentDate, Number(AUTH_DURATION)),
        userId: activeUserSession.user.id,
      };

      refreshTokens.push(refreshTokenSchema);

      foundToken.expires = new Date();

      await redis.setex(
        session.id,
        REDIS_SESSION_DEFAULT_EXPIRE,
        JSON.stringify(refreshTokens),
      );

      cookies().set({
        name: COOKIE_NAME,
        value: newAccessToken,
        expires: addMinutes(currentDate, Number(AUTH_DURATION)),
        ...COOKIE_CONFIG,
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

      const {
        db,
        session: {
          user: { sessionId },
        },
      } = ctx;

      const error = new TRPCError({ code: "UNAUTHORIZED" });

      const refreshTokens = (await redis.get(
        sessionId,
      )) as Array<RefreshTokenRedisObj>;

      const foundToken = refreshTokens.find(
        (refreshToken) => refreshToken.token === token,
      );

      if (!foundToken) {
        throw error;
      }

      await db.session.update({
        where: {
          id: sessionId,
        },
        data: { invalidatedAt: new Date() },
      });

      await redis.del(sessionId);
      cookies().delete(COOKIE_NAME);

      return {
        data: true,
      };
    }),
} satisfies TRPCRouterRecord;
