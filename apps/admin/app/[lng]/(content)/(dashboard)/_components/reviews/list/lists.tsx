"use client";

import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { z } from "zod";

import { RouterOutputs } from "@repo/api";
import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/react";
import { Review, useToast } from "@repo/ui";
import { updateReviewReactionSchema } from "@repo/validations";

export type AreaType = RouterOutputs["area"]["findById"]["data"];

type ReviewReactionType = z.infer<typeof updateReviewReactionSchema>;

export default function Lists({
  lng,
  session,
  area,
}: {
  lng: LanguagesType;
  session: User | null;
  area: AreaType;
}) {
  const { toast } = useToast();
  const router = useRouter();

  const { name, state, reviews } = area ?? {};

  const { id: userId } = session ?? {};

  const onComplete = (description: string) => {
    const onSuccess = () => {
      router.refresh();
    };

    const onError = (error: any) => {
      toast({
        variant: "destructive",
        description:
          error?.message ??
          `Error updating review ${description} reaction. Try again`,
      });
      console.error(error);
      router.refresh();
    };

    return { onSuccess, onError };
  };

  const mutateReviewLikeReaction = api.review.reviewLikeReaction.useMutation({
    onSuccess: onComplete("like").onSuccess,
    onError: onComplete("like").onError,
  });

  const mutateReviewUnlikeReaction =
    api.review.reviewUnlikeReaction.useMutation({
      onSuccess: onComplete("unlike").onSuccess,
      onError: onComplete("unlike").onError,
    });

  const mutateReviewDislikeReaction =
    api.review.reviewDislikeReaction.useMutation({
      onSuccess: onComplete("dislike").onSuccess,
      onError: onComplete("dislike").onError,
    });

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">
        {name}, {state}
      </h2>
      <div className="flex w-[65%] flex-col gap-6">
        {reviews?.map((review) => (
          <Review
            key={review.id}
            review={review}
            mutateUnlikeFunc={mutateReviewUnlikeReaction.mutate}
            mutateDislikeFunc={mutateReviewDislikeReaction.mutate}
            mutateLikeFunc={mutateReviewLikeReaction.mutate}
          />
        ))}
      </div>
    </div>
  );
}
