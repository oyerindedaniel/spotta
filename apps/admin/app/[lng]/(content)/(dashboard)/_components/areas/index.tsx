import Link from "next/link";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";

import { LanguagesType, useClientTranslation } from "@repo/i18n";
import { api } from "@repo/trpc/src/server";
import { buttonVariants, DataTable } from "@repo/ui";

import { areasColumns } from "./columns";

export default async function Areas({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: User | null;
}) {
  const { t, i18n } = useClientTranslation({ lng });

  const areas = await api.area.findAll();

  // console.log({ resolvedLanguage: i18n.resolvedLanguage });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-medium">All Areas Created</h3>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="areas/create-area"
            className={cn("", buttonVariants({ size: "xs" }))}
          >
            CREATE AREA
          </Link>
        </div>
      </div>
      <DataTable data={areas.data} columns={areasColumns} />
    </div>
  );
}
