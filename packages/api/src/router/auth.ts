import { cookies } from "next/headers";
import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import bcrypt from "bcryptjs";
import { addMinutes, isPast } from "date-fns";
import _ from "lodash";
import { v4 as uuid } from "uuid";
import { z } from "zod";

import { sendMail, SpottaEmailTemplate } from "@repo/email";
import { loginSchema } from "@repo/validations";

import { AUTH_DURATION, COOKIE_NAME, MAIN_SITE_URL } from "../config";
import { generateAccessToken, generateRefreshToken } from "../lib";
import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    const { session } = ctx;
    return session?.user ?? null;
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
              token: refreshToken.id,
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

      if (session.invalidatedAt && isPast(session.invalidatedAt)) {
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

      const newRefreshToken = generateRefreshToken(session.user);
      const newAccessToken = generateAccessToken(session.user);

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
  logout: protectedProcedure.mutation(({ ctx }) => {
    cookies().delete(COOKIE_NAME);
    return true;
  }),
} satisfies TRPCRouterRecord;
