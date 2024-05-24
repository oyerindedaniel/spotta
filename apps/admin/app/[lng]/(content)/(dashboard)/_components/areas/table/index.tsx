import { User } from "@prisma/client";

import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/server";
import { DataTable } from "@repo/ui/src/components/ui/data-table";

import { areasColumns } from "./columns";

export default async function AreasTable({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: User | null;
}) {
  const areas = await api.area.findAll();

  return <DataTable data={areas.data} columns={areasColumns} />;
}
