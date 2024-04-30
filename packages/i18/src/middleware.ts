import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

import { fallbackLng, languages, languages as ourLanguages } from "./settings";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};

const cookieName = "i18next";

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = ourLanguages;

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  const locale = matchLocale(languages, locales, fallbackLng);
  return locale;
}

const i18nConfig = {
  locales: languages,
  defaultLocale: fallbackLng,
};

export function middleware(request: NextRequest) {
  // return i18nRouter(request, i18nConfig);
  const pathname = request.nextUrl.pathname;

  // Matchers not working
  if (
    [
      "/manifest.json",
      "/favicon.ico",
      "/api",
      "/_next/static",
      "/_next/image",
      // Your other files in `public`
    ].some((prefix) => pathname.startsWith(prefix))
  ) {
    return;
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = ourLanguages.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    let locale = getLocale(request);

    const storedLocaleCookie = request.cookies.get(cookieName);

    if (storedLocaleCookie) {
      locale = storedLocaleCookie.value;
    } else {
      // cookies().set(cookieName, locale as string, {
      //   httpOnly: true,
      //   path: "/",
      //   maxAge: 30 * 24 * 60 * 60,
      // });
    }

    // e.g. incoming request is /reviews
    // The new URL is now /en/reviews
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  }
}
