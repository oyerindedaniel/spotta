import { CookieSerializeOptions } from "cookie";

type CookieOptions = Omit<CookieSerializeOptions, "sameSite"> & {
  sameSite: boolean | string | "lax" | "strict" | "none" | undefined;
};

export const DATE_CREATED_AT_FORMAT = "MMMM do, yyyy";

export const ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_SECRET ?? "No_Secret-Access!";
export const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET ?? "No_Secret-Refresh!";
export const AUTH_DURATION = process.env.AUTH_DURATION ?? 30;
export const COOKIE_NAME = process.env.COOKIE_NAME ?? "access_token";
export const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME ?? "session_token";
export const SALT_ROUNDS = process.env.SALT_ROUNDS ?? 10;
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
export const GOOGLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_SECRET ?? "";
export const GOOGLE_OAUTH_REDIRECT =
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL ?? "";
export const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ?? "";
export const GITHUB_CLIENT_SECRET = process.env.NEXT_PUBLIC_GITHUB_SECRET ?? "";
export const GITHUB_OAUTH_REDIRECT =
  process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URL ?? "";
export const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE_URL ?? "";
export const UPLOADTHING_APP_ID =
  process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID ?? "";
export const UPLOADTHING_SECRET =
  process.env.NEXT_PUBLIC_UPLOADTHING_SECRET ?? "";

export const REDIS_SESSION_DEFAULT_EXPIRE = 43200; // in seconds 12hrs

export const COOKIE_CONFIG: any = {
  httpOnly: "true",
  // secure: Boolean(Number(process.env.COOKIE_SECURE! ?? 0)),
  secure: true,
  sameSite: process.env.COOKIE_SAME_SITE! || "strict",
  path: "/",
};
