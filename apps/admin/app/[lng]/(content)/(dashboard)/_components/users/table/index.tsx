import { User } from "@prisma/client";

import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/server";
import { DataTable } from "@repo/ui/src/components/ui/data-table";

import { usersColumns } from "./columns";

export default async function UsersTable({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: User | null;
}) {
  const users = await api.user.findAll();

  return <DataTable data={users.data} columns={usersColumns} />;
}
