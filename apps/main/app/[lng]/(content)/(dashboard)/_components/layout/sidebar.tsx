"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { LanguagesType } from "@repo/i18n";

import { SideBarLinks } from "./constants";

interface SidebarProps {
  lng: LanguagesType;
  sidebarItems: SideBarLinks;
}

const Sidebar: FC<SidebarProps> = ({ lng, sidebarItems }) => {
  const pathname = usePathname();
  const checkIfLinkIsActive = (link: string) => {
    return pathname === `/${lng}/${link}`;
  };

  const isSidebarOpen = true;

  return (
    <aside
      className={cn(
        "flex h-full w-full -translate-x-full flex-col overflow-hidden text-sm text-white transition-all duration-100 ease-in-out",
        isSidebarOpen && "translate-x-0",
      )}
    >
      <div className="flex h-full flex-col justify-between overflow-y-auto">
        <div>
          {sidebarItems.map((link, Idx) => {
            const Icon = link.icon;
            return (
              <Link href={link.url} key={link.name}>
                <div
                  className={cn(
                    "duration-350 hover:text-brand mb-0 flex cursor-pointer items-center justify-start gap-2 px-4 py-3 text-black transition-all ease-in-out hover:bg-[#0B153A] hover:text-white dark:text-white hover:dark:bg-brand-blue md:justify-center xl:justify-start xl:px-4 xl:py-4",
                    checkIfLinkIsActive(link.url) &&
                      "dark:bg-brand-light bg-[#0B153A] text-white",
                    Idx !== sidebarItems.length - 1 && "mb-3",
                  )}
                >
                  <Icon />
                  <span className="block font-medium capitalize">
                    {link.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
