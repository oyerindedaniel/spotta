import { Suspense } from "react";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/server";

import Lists from "./lists";

export async function ReviewsList({
  lng,
  session,
  id,
}: {
  lng: LanguagesType;
  session: User | null;
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
  session: User | null;
  id: string;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewsList id={id} session={session} lng={lng} />
    </Suspense>
  );
}
