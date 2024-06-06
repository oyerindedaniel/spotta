"use client";

import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

import { LanguagesType } from "@repo/i18n";
import { UserDTO } from "@repo/types";

import { AreaBySlug } from ".";
import AreaComment from "./comment";
import AreaMedia from "./media";

export default function AreaMediaComment({
  lng,
  area,
  session,
}: {
  lng: LanguagesType;
  area: AreaBySlug;
  session: UserDTO;
}) {
  const {
    area: { reviews },
  } = area;

  const searchParams = useSearchParams();

  const reviewId = searchParams?.get("review");

  return reviews && reviews.length > 0 ? (
    <div
      className={cn(
        "flex flex-col gap-5",
        reviews.length > 0 ? "w-[45%]" : "w-full",
      )}
    >
      {reviewId && (
        <div className="min-h-[500px] bg-red-950">
          <AreaComment lng={lng} area={area} session={session} />
        </div>
      )}
      <AreaMedia lng={lng} area={area} session={session} />
    </div>
  ) : null;
}
