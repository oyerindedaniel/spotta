"use client";

import React from "react";
import { User } from "@prisma/client";

import { RouterOutputs } from "@repo/api";
import { LanguagesType } from "@repo/i18n";
import { Review, Separator } from "@repo/ui";

export default function AreaReview({
  lng,
  area,
  session,
}: {
  lng: LanguagesType;
  area: RouterOutputs["area"]["findBySlug"]["data"];
  session: User | null;
}) {
  const { amenities, area: foundArea } = area ?? {};

  const { reviews } = foundArea;

  return (
    <div className="w-[60%]">
      <div className="flex flex-col gap-6">
        {reviews?.map((review, idx) => (
          <React.Fragment key={review.id}>
            <Review lng={lng} review={review} session={session} />
            {idx !== reviews.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
