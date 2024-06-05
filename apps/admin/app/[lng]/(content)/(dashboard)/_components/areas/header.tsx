"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

import { LanguagesType } from "@repo/i18n";
import { UserSession } from "@repo/types";
import { buttonVariants } from "@repo/ui";

export default function AreasHeader({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: UserSession;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-2xl font-medium">All Areas Created</h3>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/areas/create-area"
          className={cn("", buttonVariants({ size: "xs" }))}
        >
          CREATE AREA
        </Link>
      </div>
    </div>
  );
}
