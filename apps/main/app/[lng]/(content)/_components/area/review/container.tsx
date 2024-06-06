"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

import { RouterOutputs } from "@repo/api";
import { LanguagesType } from "@repo/i18n";
import { UserDTO } from "@repo/types";

import AreaMedia from "./media";

export default function AreaMediaReview({
  lng,
  area,
  session,
}: {
  lng: LanguagesType;
  area: RouterOutputs["area"]["findBySlug"]["data"];
  session: UserDTO;
}) {
  const {
    area: { medias, reviews },
  } = area;

  enum Type {
    Media = "MEDIA",
    Review = "REVIEW",
  }

  const searchParams = useSearchParams();

  const reviewId = searchParams?.get("review");

  const [type, setType] = useState<Type>(Type.Media);

  useEffect(() => {
    if (reviewId) {
      setType(Type.Review);
    }
  }, [reviewId]);

  return reviews && reviews.length > 0 ? (
    <div
      className={cn(
        "flex flex-col gap-5",
        reviews.length > 0 ? "w-[45%]" : "w-full",
      )}
    >
      {reviewId && (
        <div className="min-h-[500px] bg-red-950">
          <div className="sticky top-0">ee</div>
        </div>
      )}
      {/* <div className="min-h-[430px] bg-blue-400"> */}
      <AreaMedia lng={lng} area={area} session={session} />
      {/* </div> */}
    </div>
  ) : null;
}
