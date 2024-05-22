"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";

import { LanguagesType, useClientTranslation } from "@repo/i18n";
import { buttonVariants } from "@repo/ui";

export default function Reviews({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: User | null;
}): JSX.Element {
  const { t, i18n } = useClientTranslation({ lng });

  // console.log({ resolvedLanguage: i18n.resolvedLanguage });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-medium">All Reviews Created</h3>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="reviews/create-review"
            className={cn("", buttonVariants({ size: "sm" }))}
          >
            CREATE REVIEW
          </Link>
        </div>
      </div>
    </div>
  );
}
