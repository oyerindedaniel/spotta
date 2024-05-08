import type { TRPCRouterRecord } from "@trpc/server";
import { cookies } from "next/headers";
import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { addMinutes, isPast } from "date-fns";
import _ from "lodash";
import { v4 as uuid } from "uuid";
import { z } from "zod";

import { sendMail, SpottaEmailTemplate } from "@repo/email";
import { oauthSchema, registerSchema } from "@repo/validations";

import {
  AUTH_DURATION,
  COOKIE_NAME,
  MAIN_SITE_URL,
  SALT_ROUNDS,
} from "../config";
import {
  generateAccessToken,
  generateRefreshToken,
  getGithubOauthToken,
  getGithubUser,
  getGoogleOauthToken,
  getGoogleUser,
} from "../lib";
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

      const token = uuid();

      const newUser = await db.user.create({
        data: {
          firstName,
          lastName,
          email: email.toLowerCase(),
          password: hashedPassword,
          phone,
          verificationToken: {
            create: [{ token, expires: addMinutes(new Date(), 30) }],
          },
        },
      });

      const verificationLink = `${MAIN_SITE_URL}/verify-email?token=${token}`;

      await sendMail({
        email,
        subject: "Spotta Email Verfication",
        html: SpottaEmailTemplate({
          verificationLink,
        }),
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
  githuboauth: publicProcedure
    .input(oauthSchema)
    .mutation(async ({ ctx, input }) => {
      const { headers, db } = ctx;

      const { code } = input;

      const { access_token: githubAccessToken } = await getGithubOauthToken({
        code,
      });

      const { avatar_url, email, login, name } = await getGithubUser({
        access_token: githubAccessToken,
      });

      const nameParts = name.split(" ");

      const firstName = nameParts?.[0] ?? name;
      const lastName = nameParts?.[1] ?? name;

      if (!email && !login) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Github account missing both email and username",
        });
      }

      let user: User;

      const findUser = await db.user.findUnique({
        where: { email: email ?? login },
      });

      if (!findUser) {
        user = await db.user.create({
          data: {
            email: email?.toLowerCase() ?? login,
            picture: avatar_url,
            lastName,
            firstName,
            authService: "GITHUB",
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
  emailConfirmation: publicProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { token } = input;

      const findToken = await db.verificationToken.findUnique({
        where: { token },
        include: {
          user: true,
        },
      });

      if (!findToken || isPast(findToken.expires)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The token is not available or has expired.",
        });
      }

      const userId = findToken.user.id;

      await db.user.update({
        where: { id: userId },
        data: {
          isConfirmed: true,
          emailVerified: new Date(),
        },
      });

      return true;
    }),
} satisfies TRPCRouterRecord;
