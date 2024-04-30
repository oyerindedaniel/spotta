"use client";

import Image from "next/image";
import Link from "next/link";
import { Logo, LogoDark } from "@/assets";

import { ModeToggle } from "@repo/ui";

export function Navbar() {
  return (
    <header>
      <div className="flex w-full items-center justify-between px-14 py-3">
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
                <Link href="/login" className="font-semibold text-typo-blue">
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
