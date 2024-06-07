import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

import { RouterOutputs } from "@repo/api";
import { api } from "@repo/api/src/server";
import { LanguagesType } from "@repo/i18n";
import { UserDTO } from "@repo/types";

import AreaHeader from "./header";
import AreaMedias from "./medias";
import Review from "./review";
import AreaReviews from "./reviews";

export type AreaBySlug = RouterOutputs["area"]["findBySlug"]["data"];

export async function Area({
  lng,
  slug,
  session,
}: {
  lng: LanguagesType;
  slug: string;
  session: UserDTO;
}) {
  const area = await api.area.findBySlug({ slug });

  if (!area) {
    redirect("/");
  }

  const {
    area: { reviews },
  } = area.data;

  return (
    <div>
      <AreaHeader lng={lng} area={area.data} />
      <div className={cn("flex justify-between gap-6 px-6 pb-3 pt-6 md:px-14")}>
        <div className={cn("", reviews.length > 0 ? "w-[55%]" : "w-full")}>
          <AreaReviews lng={lng} area={area.data} session={session} />
        </div>
        <div
          className={cn(
            "flex flex-col gap-5",
            reviews.length > 0 ? "w-[45%]" : "w-full",
          )}
        >
          <Review
            lng={lng}
            session={session}
            reviews={area.data.area.reviews}
          />
          <AreaMedias lng={lng} area={area.data} session={session} />
        </div>
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
  session: UserDTO;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Area lng={lng} slug={slug} session={session} />
    </Suspense>
  );
}
