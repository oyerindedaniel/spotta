import { User } from "@prisma/client";

import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/server";
import { DataTable } from "@repo/ui/src/components/ui/data-table";

import { reviewsColumns } from "./columns";

export default async function ReviewsTable({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: User | null;
}) {
  const reviews = await api.review.findAll();

  return <DataTable data={reviews.data} columns={reviewsColumns} />;
}
