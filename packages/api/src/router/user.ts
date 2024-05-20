import { cookies } from "next/headers";
import { Session, User } from "@prisma/client";
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
import { RefreshTokenRedisObj } from "@repo/types";
import {
  forgotPasswordConfirmationSchema,
  forgotPasswordSchema,
  oauthSchema,
  registerSchema,
  resetPasswordSchema,
  updateSchema,
} from "@repo/validations";

import {
  AUTH_DURATION,
  COOKIE_CONFIG,
  COOKIE_NAME,
  MAIN_SITE_URL,
  REDIS_SESSION_DEFAULT_EXPIRE,
  SALT_ROUNDS,
} from "../config";
import { redis } from "../config/redis";
import {
  generateAccessToken,
  generateRefreshToken,
  getGithubOauthToken,
  getGithubUser,
  getGoogleOauthToken,
  getGoogleUser,
} from "../lib";
import { protectedProcedure, publicProcedure } from "../trpc";
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
  update: protectedProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const { id, email: oldUserEmail } = session.user;

      const { firstName, lastName, phone, email, picture } = input;

      const pictureUrl = picture[0];

      const updateUser = await db.user.update({
        where: { id, isConfirmed: { not: false } },
        data: {
          firstName,
          lastName,
          phone,
          email,
          ...(oldUserEmail.toLowerCase() !== email.toLowerCase() && {
            isConfirmed: false,
          }),
          ...(typeof pictureUrl === "string" && { picture: pictureUrl }),
        },
      });

      return {
        data: updateUser,
      };
    }),
  googleoauth: publicProcedure
    .input(oauthSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, userAgent } = ctx;

      const { os, browser } = userAgent ?? {};

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

      const currentDate = new Date();

      const session = await db.session.create({
        data: {
          user: { connect: { id: user.id } },
          os: os?.name ?? "",
          browser: browser?.name ?? "",
          expires: addMinutes(currentDate, Number(AUTH_DURATION)),
        },
      });

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
          ttl: Number(AUTH_DURATION) * 60 * 1000, // in millesconds
          sessionId: session.id,
        },
      };
    }),
  githuboauth: publicProcedure
    .input(oauthSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, userAgent } = ctx;

      const { os, browser } = userAgent ?? {};

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

      const currentDate = new Date();

      const session = await db.session.create({
        data: {
          user: { connect: { id: user.id } },
          os: os?.name ?? "",
          browser: browser?.name ?? "",
          expires: addMinutes(currentDate, Number(AUTH_DURATION)),
        },
      });

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
          ttl: Number(AUTH_DURATION) * 60 * 1000, // in millesconds
          sessionId: session.id,
        },
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

      return {
        data: true,
      };
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

      // TODO: work on this

      // TODO: invalidate all session on forgot and reset password

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

      return {
        data: true,
      };
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
          sessions: {
            updateMany: {
              where: { userId: user.id },
              data: { invalidatedAt: new Date() },
            },
          },
        },
      });

      return {
        data: { ..._.omit(updatedUser, ["password"]) },
      };
    }),
  resetPassword: protectedProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { newPassword, confirmNewPassword, oldPassword } = input;
      const { id, password } = session.user;

      const error = new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      });

      const oldPasswordMatch = await bcrypt.compare(
        oldPassword,
        password ?? "",
      );

      if (!oldPasswordMatch) {
        throw error;
      }

      if (newPassword !== confirmNewPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords don't match",
        });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

      await db.user.update({
        where: {
          id: id,
        },
        data: {
          password: hashedNewPassword,
          sessions: {
            updateMany: {
              where: { userId: id },
              data: { invalidatedAt: new Date() },
            },
          },
        },
      });

      return {
        data: true,
      };
    }),
  sessions: protectedProcedure.query(async ({ ctx }) => {
    const { session, db } = ctx;

    const { id } = session.user;

    // TODO: optimise, sessions can be a lot querying with invalidated null
    const sessions = await db.session.findMany({
      where: {
        user: { id },
        invalidatedAt: null,
        expires: { gt: new Date() },
      },
    });

    console.log(sessions);

    async function checkExpiry(sessions: Session[]): Promise<Array<Session>> {
      const activeSessions: Array<Session> = [];

      for (const session of sessions) {
        const id = (await redis.get(
          session.id,
        )) as Array<RefreshTokenRedisObj> | null;

        if (id) {
          const tokenObjArray = id;
          if (
            tokenObjArray.some(
              (tokenObj) => new Date(tokenObj.expires) > new Date(),
            )
          ) {
            activeSessions.push(session);
          }
        }
      }

      return activeSessions;
    }

    const activeSessions = await checkExpiry(sessions);

    console.log({ activeSessions });

    return {
      data: activeSessions ?? [],
    };
  }),
  updateSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const { sessionId: activeSessionId } = session.user;

      const { sessionId } = input;

      await db.session.update({
        where: {
          id: sessionId,
          NOT: { id: activeSessionId },
        },
        data: {
          invalidatedAt: new Date(),
        },
      });

      return {
        data: true,
      };
    }),
} satisfies TRPCRouterRecord;
