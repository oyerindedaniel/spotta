import { User } from "@prisma/client";

import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/server";
import { DataTable } from "@repo/ui/src/components/ui/data-table";

import { amenitiesColumns } from "./columns";

export default async function AmenitiesTable({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: User | null;
}) {
  const amenities = await api.amenity.findAll();

  return <DataTable data={amenities.data} columns={amenitiesColumns} />;
}
