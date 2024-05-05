import { cookies } from "next/headers";
import { CookieSerializeOptions } from "cookie";

type CookieOptions = Omit<CookieSerializeOptions, "sameSite"> & {
  sameSite: boolean | string | "lax" | "strict" | "none" | undefined;
};

export const ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_SECRET ?? "No_Secret-Access!";
export const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET ?? "No_Secret-Refresh!";
export const AUTH_DURATION = process.env.AUTH_DURATION ?? 15;
export const COOKIE_NAME = process.env.COOKIE_NAME ?? "access_token";
export const SALT_ROUNDS = process.env.SALT_ROUNDS ?? 10;

export const COOKIE_CONFIG: CookieOptions = {
  httpOnly: true,
  secure: Boolean(Number(process.env.COOKIE_SECURE! || 0)),
  sameSite: process.env.COOKIE_SAME_SITE! || "lax",
};
