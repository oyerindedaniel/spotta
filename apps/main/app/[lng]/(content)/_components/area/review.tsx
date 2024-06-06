"use client";

import { useSearchParams } from "next/navigation";

import { api } from "@repo/api/src/react";
import { LanguagesType } from "@repo/i18n";
import { UserDTO } from "@repo/types";
import { Review, Separator } from "@repo/ui";

import CommentInput from "./comment/input";

export default function ReviewComp({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: UserDTO;
}) {
  const searchParams = useSearchParams();

  const reviewId = searchParams?.get("review");

  const { isPending, data, fetchStatus } = api.review.findById.useQuery(
    {
      id: reviewId!,
    },
    { enabled: !!reviewId, refetchOnWindowFocus: false },
  );

  return isPending && fetchStatus !== "idle" ? (
    <div>Loading review ...</div>
  ) : data ? (
    <div className="min-h-[500px]">
      <div className="sticky top-0">
        <div className="mb-5">
          <Review lng={lng} review={data.data} session={session} />
        </div>
        <Separator />
        <div className="my-2">
          <CommentInput lng={lng} session={session} review={data.data} />
        </div>
        <Separator />
      </div>
    </div>
  ) : null;
}
