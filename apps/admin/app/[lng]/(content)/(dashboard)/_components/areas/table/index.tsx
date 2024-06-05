import { api } from "@repo/api/src/server";
import { LanguagesType } from "@repo/i18n";
import { UserSession } from "@repo/types";
import { DataTable } from "@repo/ui/src/components/ui/data-table";

import { areasColumns } from "./columns";

export default async function AreasTable({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: UserSession;
}) {
  const areas = await api.area.findAll();

  return <DataTable data={areas.data} columns={areasColumns} />;
}
