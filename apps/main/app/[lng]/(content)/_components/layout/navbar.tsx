"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/assets";
import { User } from "@prisma/client";

import { LanguagesType, useClientTranslation } from "@repo/i18n";
import { ModeToggle } from "@repo/ui";
import { assignRedirectUrl } from "@repo/utils";

type AuthPage = "login" | "register";

export function Navbar({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: User | null;
}) {
  const pathname = usePathname();
  const { t, i18n } = useClientTranslation({ lng });

  const page = pathname.split("/").at(-1) as AuthPage;

  const resolvedLanguage = i18n.resolvedLanguage;

  return (
    <header>
      <div className="mb-6 flex w-full items-center justify-between px-6 py-3 md:px-14">
        <div>
          <Image
            alt="Spotta"
            className="block dark:hidden"
            height={120}
            priority
            src={Icons.logo}
            width={120}
          />
          <Image
            alt="Spotta"
            className="hidden dark:block"
            height={120}
            priority
            src={Icons.logoDark}
            width={120}
          />
        </div>

        <div className="flex items-center gap-8">
          <ModeToggle />
          <nav>
            <ul>
              <li>
                {session ? (
                  <Link href="/">Authenticated</Link>
                ) : (
                  <Link
                    href={
                      page === "login"
                        ? `${assignRedirectUrl({ redirectUrl: `${pathname}`, goToPageUrl: `${lng}/register` })}`
                        : `${assignRedirectUrl({ redirectUrl: `${pathname === `/${lng}/register` ? "/" : pathname}`, goToPageUrl: `${lng}/login` })}`
                    }
                    className="font-semibold uppercase text-brand-blue"
                  >
                    {page === "login" ? "Register" : "Login"}
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
