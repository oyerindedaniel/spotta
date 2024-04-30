"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, LogoDark } from "@/assets";

import { ModeToggle } from "@repo/ui";

type AuthPage = "login" | "register";

export function Navbar() {
  const pathname = usePathname();

  const page = pathname.split("/").at(-1) as AuthPage;

  return (
    <header>
      <div className="mb-6 flex w-full items-center justify-between px-14 py-3">
        <div>
          <Image
            alt="Spotta"
            className="block dark:hidden"
            height={120}
            priority
            src={Logo}
            width={120}
          />
          <Image
            alt="Spotta"
            className="hidden dark:block"
            height={120}
            priority
            src={LogoDark}
            width={120}
          />
        </div>

        <div className="flex items-center gap-8">
          <ModeToggle />
          <nav>
            <ul>
              <li>
                <Link
                  href={page === "login" ? "/register" : "/login"}
                  className="font-semibold text-brand-blue"
                >
                  {page === "login" ? "Register" : "Login"}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
