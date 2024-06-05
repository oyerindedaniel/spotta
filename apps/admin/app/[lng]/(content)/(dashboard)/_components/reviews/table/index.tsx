import { api } from "@repo/api/src/server";
import { LanguagesType } from "@repo/i18n";
import { UserSession } from "@repo/types";
import { DataTable } from "@repo/ui/src/components/ui/data-table";

import { reviewsColumns } from "./columns";

export default async function ReviewsTable({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: UserSession;
}) {
  const reviews = await api.review.findAll();

  return <DataTable data={reviews.data} columns={reviewsColumns} />;
}
