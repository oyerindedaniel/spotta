import { CookieSerializeOptions } from "cookie";

type CookieOptions = Omit<CookieSerializeOptions, "sameSite"> & {
  sameSite: boolean | string | "lax" | "strict" | "none" | undefined;
};

export const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET!;
export const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;
export const AUTH_DURATION = process.env.AUTH_DURATION!;

export const COOKIE_CONFIG: CookieOptions = {
  httpOnly: true,
  secure: Boolean(Number(process.env.COOKIE_SECURE! || 0)),
  sameSite: process.env.COOKIE_SAME_SITE! || "lax",
};
