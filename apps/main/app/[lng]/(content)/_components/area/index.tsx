import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";

import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/server";

import AreaHeader from "./header";
import AreaMedia from "./media";
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

  const {
    area: { medias, reviews },
  } = area.data;

  return (
    <div>
      <AreaHeader lng={lng} area={area.data} />
      <div className={cn("flex justify-between gap-6 px-6 pb-3 pt-6 md:px-14")}>
        <div className={cn("", reviews.length > 0 ? "w-[60%]" : "w-full")}>
          <AreaReview lng={lng} area={area.data} session={session} />
        </div>
        {reviews && reviews.length > 0 && (
          <div className={cn("", reviews.length > 0 ? "" : "w-full")}>
            <AreaMedia lng={lng} area={area.data} session={session} />
          </div>
        )}
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
