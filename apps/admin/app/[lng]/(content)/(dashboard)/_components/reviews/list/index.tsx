import { Suspense } from "react";
import { redirect } from "next/navigation";

import { api } from "@repo/api/src/server";
import { LanguagesType } from "@repo/i18n";
import { UserSession } from "@repo/types";

import Lists from "./lists";

export async function ReviewsList({
  lng,
  session,
  id,
}: {
  lng: LanguagesType;
  session: UserSession;
  id: string;
}) {
  const area = await api.area.findById({ id });

  if (!area || !area?.data) {
    redirect("/areas");
  }

  return <Lists area={area.data} session={session} lng={lng} />;
}

export async function ReviewsListSuspense({
  lng,
  session,
  id,
}: {
  lng: LanguagesType;
  session: UserSession;
  id: string;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewsList id={id} session={session} lng={lng} />
    </Suspense>
  );
}
