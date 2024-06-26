"use client";

import { Area } from "@prisma/client";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { RouterOutputs } from "@repo/api";
import { api } from "@repo/api/src/react";
import { useDisclosure, useInitialRender, useSessionStore } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";
import { UserDTO } from "@repo/types";
import { formatTimeAgo, getInitials } from "@repo/utils";
import { updateReviewReactionSchema } from "@repo/validations";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  AuthModal,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  CreateEditReview,
  DeleteReview,
  ModalContainer,
  useToast,
} from "..";
import { ButtonDelete, ButtonEdit } from "./button";
import { CommentButton } from "./comment";
import { DislikeButton, LikeButton } from "./rating";

type Review = RouterOutputs["review"]["findById"]["data"];
type ReviewReactionType = z.infer<typeof updateReviewReactionSchema>;

interface Props {
  lng: LanguagesType;
  review: Review;
  session?: UserDTO;
}

// TODO: make logic better

export function Review(props: Props) {
  const {
    data: { userId },
  } = useSessionStore();

  const { toast } = useToast();
  const router = useRouter();

  const initialRenderComplete = useInitialRender();

  const {
    areaId,
    asAnonymous,
    id: reviewId,
    createdBy,
    createdAt,
    description,
    rating,
    amenities,
    likeReactions,
    dislikeReactions,
    _count,
  } = props.review;

  const { session, lng, review } = props;
  const { id: createdById, firstName, lastName, picture, role } = createdBy;

  const {
    isOpen: isOpenEdit,
    onClose: onCloseEdit,
    onOpen: onOpenEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onClose: onCloseDelete,
    onOpen: onOpenDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenSession,
    onClose: onCloseSession,
    onOpen: onOpenSession,
  } = useDisclosure();

  const pathname = usePathname();

  const {
    likeReactions: likeReactionCount,
    dislikeReactions: dislikeReactionsCount,
    comments: commentsCount,
  } = _count;

  const defaultLikeReaction = likeReactions.find(
    (reaction) =>
      reaction.userId === userId && reaction.likeReviewId === reviewId,
  )?.type;

  const defaultDislikeReaction = dislikeReactions.find(
    (reaction) =>
      reaction.userId === userId && reaction.dislikeReviewId === reviewId,
  )?.type;

  const defaultReaction = defaultLikeReaction || defaultDislikeReaction || null;

  const [reaction, setReaction] = useState<ReviewReactionType["type"] | null>(
    defaultReaction,
  );

  const isLiked = reaction === "LIKE";

  const isDisliked = reaction === "DISLIKE";

  const [likeCount, setLikeCount] = useState(likeReactionCount || 0);
  const [dislikeCount, setDislikeCount] = useState(dislikeReactionsCount || 0);

  useEffect(() => {
    if (defaultReaction && initialRenderComplete) {
      setReaction(defaultReaction);
    }
  }, [initialRenderComplete]);

  const onComplete = (description: string) => {
    const onSuccess = <T extends ReviewReactionType["type"]>(
      data: {
        data: T;
      },
      variables: {
        id: string;
        type: T;
      },
      context: unknown,
    ) => {
      const { data: type } = data;
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

  const mutateLikeFunc = api.review.reviewLikeReaction.useMutation({
    onSuccess: onComplete("like").onSuccess,
    onError: onComplete("like").onError,
  });

  const mutateUnlikeFunc = api.review.reviewUnlikeReaction.useMutation({
    onSuccess: onComplete("unlike").onSuccess,
    onError: onComplete("unlike").onError,
  });

  const mutateDislikeFunc = api.review.reviewDislikeReaction.useMutation({
    onSuccess: onComplete("dislike").onSuccess,
    onError: onComplete("dislike").onError,
  });

  return (
    <div>
      <AuthModal
        title="Reviews"
        body="To add a reaction to this review, please login or create an account with us."
        lng={lng}
        isOpen={isOpenSession}
        onClose={onCloseSession}
        onOpen={onOpenSession}
      />
      <ModalContainer
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        title="Edit Review"
      >
        <CreateEditReview
          lng={lng}
          type="edit"
          intent="modal"
          areaId={areaId}
          review={{ ...review, area: {} as Area }}
          onClose={onCloseEdit}
        />
      </ModalContainer>
      <DeleteReview
        onOpen={onOpenDelete}
        onClose={onCloseDelete}
        isOpen={isOpenDelete}
        data={{ ...review, area: {} as Area }}
      />
      <div>
        {userId === createdById && (
          <div className="flex justify-end mb-2 gap-1.5">
            <ButtonEdit onClick={onOpenEdit} />
            <ButtonDelete onClick={onOpenDelete} />
          </div>
        )}
        <div className="mb-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-3 text-sm mb-3">
              <Avatar>
                <AvatarImage src={picture ?? ""} alt={`@${firstName}`} />
                <AvatarFallback>
                  {getInitials(`${firstName} ${lastName}`)}
                </AvatarFallback>
              </Avatar>
              {asAnonymous && role === "USER" ? (
                <span className="capitalize">Anonymous</span>
              ) : (
                <div>
                  <span className="capitalize">{firstName}</span>{" "}
                  <span className="capitalize">{lastName.slice(0, 1)}.</span>
                </div>
              )}
              <span className="text-gray-500">{formatTimeAgo(createdAt)}</span>
            </div>
            <span className="flex self-start items-center gap-1">
              <StarFilledIcon color="#fcc419" />
              {`${rating}.0`}
            </span>
          </div>
          <div className="text-sm">{description}</div>
        </div>
        <div className="flex gap-3 items-center mb-3 flex-wrap">
          {amenities.map((amenity) => (
            <Badge key={amenity.id} variant="secondary">
              {amenity.name}
            </Badge>
          ))}
        </div>
        <div className="flex gap-6 items-center">
          <LikeButton
            isLiked={isLiked}
            onToggleLike={(action) => {
              if (!session) {
                return onOpenSession();
              }
              setReaction(action);
              setLikeCount((prevCount) =>
                action === "LIKE" ? prevCount + 1 : prevCount - 1,
              );
              if (reaction === "DISLIKE") {
                setDislikeCount((prevCount) => prevCount - 1);
              }
              action === "LIKE"
                ? mutateLikeFunc.mutate({ id: reviewId, type: action })
                : mutateUnlikeFunc.mutate({ id: reviewId, type: action });
            }}
            count={likeCount}
          />
          <DislikeButton
            isDisliked={isDisliked}
            onToggleDislike={(action) => {
              if (!session) {
                return onOpenSession();
              }
              setReaction(action);
              setDislikeCount((prevCount) =>
                action === "DISLIKE" ? prevCount + 1 : prevCount - 1,
              );
              if (reaction === "LIKE") {
                setLikeCount((prevCount) => prevCount - 1);
              }
              action === "DISLIKE"
                ? mutateDislikeFunc.mutate({ id: reviewId, type: action })
                : mutateUnlikeFunc.mutate({ id: reviewId, type: action });
            }}
            count={dislikeCount}
          />
          <CommentButton
            onClick={() => router.push(`${pathname}?review=${reviewId}`)}
            count={commentsCount}
          />
        </div>
      </div>
    </div>
  );
}
