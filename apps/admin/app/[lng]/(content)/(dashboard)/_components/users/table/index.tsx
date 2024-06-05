import { api } from "@repo/api/src/server";
import { LanguagesType } from "@repo/i18n";
import { UserSession } from "@repo/types";
import { DataTable } from "@repo/ui/src/components/ui/data-table";

import { usersColumns } from "./columns";

export default async function UsersTable({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: UserSession;
}) {
  const users = await api.user.findAll();

  return <DataTable data={users.data} columns={usersColumns} />;
}
