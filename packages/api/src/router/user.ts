import type { TRPCRouterRecord } from "@trpc/server";
import { cookies } from "next/headers";
import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { addMinutes } from "date-fns";
import _ from "lodash";

import { oauthSchema, registerSchema } from "@repo/validations";

import { AUTH_DURATION, COOKIE_NAME, SALT_ROUNDS } from "../config";
import { getGoogleOauthToken, getGoogleUser } from "../lib/google-oauth";
import { generateAccessToken, generateRefreshToken } from "../lib/token";
import { publicProcedure } from "../trpc";

export const userRouter = {
  create: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const { firstName, lastName, password, confirmPassword, email, phone } =
        input;
      const { db } = ctx;

      const emailExists = await db.user.findUnique({
        where: {
          email,
        },
      });

      if (emailExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already exists",
        });
      }

      const phoneExists = await db.user.findFirst({
        where: {
          phone,
        },
      });

      if (phoneExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Phone number already exists",
        });
      }

      if (password !== confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords don't match",
        });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const newUser = await db.user.create({
        data: {
          firstName,
          lastName,
          email: email.toLowerCase(),
          password: hashedPassword,
          phone,
        },
      });

      return {
        data: { ..._.omit(newUser, ["password"]) },
      };
    }),
  googleoauth: publicProcedure
    .input(oauthSchema)
    .mutation(async ({ ctx, input }) => {
      const { headers, db } = ctx;

      const { code } = input;

      const { id_token, access_token: googleAccessToken } =
        await getGoogleOauthToken({ code });

      const { verified_email, email, family_name, given_name, picture } =
        await getGoogleUser({
          id_token,
          access_token: googleAccessToken,
        });

      if (!verified_email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Google account not verified",
        });
      }

      let user: User;

      const findUser = await db.user.findUnique({ where: { email } });

      if (!findUser) {
        user = await db.user.create({
          data: {
            email: email.toLowerCase(),
            picture,
            lastName: family_name,
            firstName: given_name,
            authService: "GOOGLE",
            isConfirmed: true,
          },
        });
      } else {
        user = findUser;
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
        data: { ..._.omit(user, ["password"]) },
      };
    }),
} satisfies TRPCRouterRecord;
