import { User } from "@prisma/client";

import { api } from "@repo/api/src/server";
import { LanguagesType } from "@repo/i18n";
import { UserSession } from "@repo/types";
import { DataTable } from "@repo/ui/src/components/ui/data-table";

import { amenitiesColumns } from "./columns";

export default async function AmenitiesTable({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: UserSession;
}) {
  const amenities = await api.amenity.findAll();

  return <DataTable data={amenities.data} columns={amenitiesColumns} />;
}
