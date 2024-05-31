import { Suspense } from "react";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/server";

import AreaHeader from "./header";
import AreaReview from "./review";

export async function Area({
  lng,
  slug,
  session,
}: {
  lng: LanguagesType;
  slug: string;
  session: User | null;
}) {
  const area = await api.area.findBySlug({ slug });

  if (!area) {
    redirect("/");
  }

  return (
    <div>
      <AreaHeader lng={lng} area={area.data} />
      <div className="px-6 pb-3 pt-6 md:px-14">
        <AreaReview lng={lng} area={area.data} session={session} />
        <div className="w-[40%]"></div>
      </div>
    </div>
  );
}

export default async function AreaSuspense({
  lng,
  slug,
  session,
}: {
  lng: LanguagesType;
  slug: string;
  session: User | null;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Area lng={lng} slug={slug} session={session} />
    </Suspense>
  );
}
