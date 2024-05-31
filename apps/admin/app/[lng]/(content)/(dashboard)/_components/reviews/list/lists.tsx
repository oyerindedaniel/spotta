"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { z } from "zod";

import { RouterOutputs } from "@repo/api";
import { useDisclosure } from "@repo/hooks/src/use-disclosure";
import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/react";
import {
  Button,
  CreateEditReview,
  ModalContainer,
  Review,
  Separator,
  useToast,
} from "@repo/ui";
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

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { id: areaId, name, state, reviews } = area ?? {};

  const { id: userId } = session ?? {};

  const onComplete = (description: string) => {
    const onSuccess = () => {
      // router.refresh();
    };

    const onError = (error: any) => {
      router.refresh();
      toast({
        variant: "destructive",
        description:
          error?.message ??
          `Error updating review ${description} reaction. Try again`,
      });
      console.error(error);
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

  const onModalClose = () => {
    onClose();
  };

  return (
    <>
      <ModalContainer isOpen={isOpen} onClose={onClose} title="Create review">
        <CreateEditReview
          lng={lng}
          type="create"
          intent="modal"
          areaId={areaId}
          onClose={onModalClose}
        />
      </ModalContainer>
      <div>
        <div className="w-[65%]">
          <div className="mb-6 flex items-center justify-between gap-6">
            <h2 className="text-2xl font-semibold">
              {name}, {state}
            </h2>
            <Button size="xs" className="uppercase" onClick={() => onOpen()}>
              leave a review
            </Button>
          </div>
          <div className="flex flex-col gap-6">
            {reviews?.map((review, idx) => (
              <React.Fragment key={review.id}>
                <Review
                  lng={lng}
                  review={review}
                  mutateUnlikeFunc={mutateReviewUnlikeReaction.mutate}
                  mutateDislikeFunc={mutateReviewDislikeReaction.mutate}
                  mutateLikeFunc={mutateReviewLikeReaction.mutate}
                />
                {idx !== reviews.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
