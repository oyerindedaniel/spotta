"use client";

import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/assets";
import { cn } from "@/lib/utils";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

import { LanguagesType } from "@repo/i18n";
import { Button, Sheet, SheetContent, SheetTrigger } from "@repo/ui";

import { SIDEBAR_LINKS } from "./constants";
import Sidebar from "./sidebar";

const SheetSidebar = ({ lng }: { lng: LanguagesType }) => {
  return (
    <aside className={cn("")}>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <HamburgerMenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 pt-[64px]">
          <Link href="/" className="mb-3 ml-5 inline-block">
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
          </Link>

          <Sidebar sidebarItems={SIDEBAR_LINKS} lng={lng} />
        </SheetContent>
      </Sheet>
    </aside>
  );
};

export default SheetSidebar;
