import { cookies } from "next/headers";
import { User } from "@prisma/client";
import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import bcrypt from "bcryptjs";
import { addMinutes, isAfter, isPast } from "date-fns";
import _ from "lodash";
import { v4 as uuid } from "uuid";
import { z } from "zod";

import {
  sendMail,
  SpottaEmailTemplate,
  SpottaForgotPasswordEmailTemplate,
} from "@repo/email";
import {
  forgotPasswordConfirmationSchema,
  forgotPasswordSchema,
  oauthSchema,
  registerSchema,
} from "@repo/validations";

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
import { generateRandomNumber } from "../utils";

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
          verificationTokens: {
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

      await db.session.create({
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

      await db.session.create({
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

      if (
        !findToken ||
        isPast(findToken.expires) ||
        findToken.user.isConfirmed
      ) {
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
  forgotPassword: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const { email } = input;

      const user = await db.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found or account deactivated.",
        });
      }

      if (user.authService !== "CREDENTIALS") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot change password for non-credentials based accounts.",
        });
      }

      const codePin = generateRandomNumber(6);

      await db.otp.create({
        data: {
          user: { connect: { id: user.id } },
          otp: codePin,
          expires: addMinutes(new Date(), 30),
          type: "FORGOT_PASSWORD",
        },
      });

      await sendMail({
        email,
        subject: "Spotta Forgot Password Email Verfication",
        html: SpottaForgotPasswordEmailTemplate({
          codePin,
        }),
      });

      return true;
    }),
  forgotPasswordConfirmation: publicProcedure
    .input(forgotPasswordConfirmationSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const { otp, password, confirmPassword } = input;

      const findOtp = await db.otp.findUnique({
        where: { otp, type: "FORGOT_PASSWORD" },
        include: {
          user: true,
        },
      });

      if (
        !findOtp ||
        isPast(findOtp?.expires) ||
        isAfter(findOtp?.user?.updatedAt, findOtp?.createdAt)
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The otp is not available or has expired.",
        });
      }

      const user = findOtp.user;

      if (password !== confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords don't match",
        });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const updatedUser = await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
        },
      });

      return {
        data: { ..._.omit(updatedUser, ["password"]) },
      };
    }),
} satisfies TRPCRouterRecord;
