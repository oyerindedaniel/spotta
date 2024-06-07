"use client";

import { useSearchParams } from "next/navigation";
import { Area } from "@prisma/client";

import { RouterOutputs } from "@repo/api";
import { LanguagesType } from "@repo/i18n";
import { UserDTO } from "@repo/types";
import { Comment, Review, ScrollArea, Separator } from "@repo/ui";

import CommentInput from "./comment/input";

export default function ReviewComp({
  lng,
  session,
  reviews,
}: {
  lng: LanguagesType;
  session: UserDTO;
  reviews: RouterOutputs["area"]["findBySlug"]["data"]["area"]["reviews"];
}) {
  const searchParams = useSearchParams();

  const reviewId = searchParams?.get("review");

  if (!reviewId) {
    return null;
  }

  const foundReview = reviews.find((review) => review.id === reviewId);

  if (!foundReview) {
    return null;
  }

  return (
    <div className="min-h-[800px]">
      <div className="sticky top-0">
        <div className="mb-5">
          <Review
            lng={lng}
            review={{ ...foundReview, area: {} as Area }}
            session={session}
          />
        </div>
        <Separator />
        <div className="my-2">
          <CommentInput
            lng={lng}
            session={session}
            review={{ ...foundReview, area: {} as Area }}
          />
        </div>
        <Separator className="mb-5" />
        {foundReview.comments && foundReview.comments.length > 0 && (
          <div className="flex flex-col gap-4 pl-8">
            <h4 className="font-medium">Comment(s)</h4>
            <ScrollArea className="h-fit w-full">
              <div className="max-h-72">
                <div>
                  {foundReview.comments.map((comment) => (
                    <Comment lng={lng} session={session} comment={comment} />
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
