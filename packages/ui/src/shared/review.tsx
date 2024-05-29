"use client";

import { StarFilledIcon } from "@radix-ui/react-icons";
import { RouterOutputs } from "@repo/api";
import { useDebounce } from "@repo/hooks/src/use-debounce";
import { useDisclosure } from "@repo/hooks/src/use-disclosure";
import { useInitialRender } from "@repo/hooks/src/use-initial-render";
import { useSessionStore } from "@repo/hooks/src/use-session-store";
import { LanguagesType } from "@repo/i18n";
import { formatTimeAgo, getInitials } from "@repo/utils";
import {
  updateReviewDislikeReactionSchema,
  updateReviewLikeReactionSchema,
  updateReviewReactionSchema,
  updateReviewUnlikeReactionSchema,
} from "@repo/validations";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  CreateEditReview,
  ModalContainer,
} from "..";
import { DislikeButton, LikeButton } from "./rating";

type Review = RouterOutputs["area"]["findById"]["data"]["reviews"][number];
type ReviewReactionType = z.infer<typeof updateReviewReactionSchema>;
type ReviewLikeReactionType = z.infer<typeof updateReviewLikeReactionSchema>;
type ReviewDislikeReactionType = z.infer<
  typeof updateReviewDislikeReactionSchema
>;
type ReviewUnlikeReactionType = z.infer<
  typeof updateReviewUnlikeReactionSchema
>;

interface Props {
  lng: LanguagesType;
  review: Review;
  mutateLikeFunc: (data: ReviewLikeReactionType) => void;
  mutateDislikeFunc: (data: ReviewDislikeReactionType) => void;
  mutateUnlikeFunc: (data: ReviewUnlikeReactionType) => void;
}

// TODO: make logic better

export function Review(props: Props) {
  const {
    data: { userId },
  } = useSessionStore();

  const initialRenderComplete = useInitialRender();

  const {
    areaId,
    id: reviewId,
    createdBy,
    description,
    rating,
    amenities,
    likeReactions,
    dislikeReactions,
    _count,
  } = props.review;

  const { mutateDislikeFunc, mutateLikeFunc, mutateUnlikeFunc, lng, review } =
    props;

  const {
    id: createdById,
    firstName,
    lastName,
    picture,
    createdAt,
  } = createdBy;

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

  const pathname = usePathname();

  const {
    likeReactions: likeReactionCount,
    dislikeReactions: dislikeReactionsCount,
  } = _count;

  const defaultLikeReaction = likeReactions.find(
    (reaction) =>
      reaction.userId === userId && reaction.likeReviewId === reviewId
  )?.type;

  const defaultDislikeReaction = dislikeReactions.find(
    (reaction) =>
      reaction.userId === userId && reaction.dislikeReviewId === reviewId
  )?.type;

  const isFirstRenderCompleted = useRef(false);

  const defaultReaction = defaultLikeReaction || defaultDislikeReaction || null;

  const [reaction, setReaction] = useState<ReviewReactionType["type"] | null>(
    defaultReaction
  );

  const debouncedReaction = useDebounce(reaction, 1000);

  const isLiked = reaction === "LIKE";

  const isDisliked = reaction === "DISLIKE";

  const [likeCount, setLikeCount] = useState(likeReactionCount || 0);
  const [dislikeCount, setDislikeCount] = useState(dislikeReactionsCount || 0);

  useEffect(() => {
    if (defaultReaction && initialRenderComplete) {
      setReaction(defaultReaction);
    }
  }, [initialRenderComplete]);

  return (
    <>
      <ModalContainer
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        title="Edit review"
      >
        <CreateEditReview
          lng={lng}
          type="edit"
          intent="modal"
          areaId={areaId}
          review={{ ...(review as any) }}
          onClose={onCloseEdit}
        />
      </ModalContainer>
      <ModalContainer
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        title="Delete review"
      >
        <></>
      </ModalContainer>
      <div>
        {userId === createdById && (
          <div className="flex justify-end mb-2 gap-1.5">
            <Button
              onClick={onOpenEdit}
              variant="ghost"
              size="icon"
              className="justify-self-end"
            >
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16.7574 2.99677L9.29145 10.4627L9.29886 14.7098L13.537 14.7024L21 7.23941V19.9968C21 20.5491 20.5523 20.9968 20 20.9968H4C3.44772 20.9968 3 20.5491 3 19.9968V3.99677C3 3.44448 3.44772 2.99677 4 2.99677H16.7574ZM20.4853 2.09727L21.8995 3.51149L12.7071 12.7039L11.2954 12.7063L11.2929 11.2897L20.4853 2.09727Z"></path>
              </svg>
            </Button>
            <Button
              onClick={() => {}}
              variant="ghost"
              size="icon"
              className="justify-self-end"
            >
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 6V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7ZM13.4142 13.9997L15.182 12.232L13.7678 10.8178L12 12.5855L10.2322 10.8178L8.81802 12.232L10.5858 13.9997L8.81802 15.7675L10.2322 17.1817L12 15.4139L13.7678 17.1817L15.182 15.7675L13.4142 13.9997ZM9 4V6H15V4H9Z"></path>
              </svg>
            </Button>
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
              <div>
                <span className="capitalize">{firstName}</span>{" "}
                <span className="capitalize">{lastName.slice(0, 1)}.</span>
              </div>
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
              setReaction(action);
              setLikeCount((prevCount) =>
                action === "LIKE" ? prevCount + 1 : prevCount - 1
              );
              (dislikeReactionsCount !== dislikeCount ||
                defaultDislikeReaction) &&
                setDislikeCount((prevCount) =>
                  prevCount >= dislikeReactionsCount ? prevCount - 1 : 0
                );
              action === "LIKE"
                ? mutateLikeFunc({ id: reviewId, type: action })
                : mutateUnlikeFunc({ id: reviewId, type: action });
            }}
            count={likeCount}
          />
          <DislikeButton
            isDisliked={isDisliked}
            onToggleDislike={(action) => {
              setReaction(action);
              setDislikeCount((prevCount) =>
                action === "DISLIKE" ? prevCount + 1 : prevCount - 1
              );
              (likeReactionCount !== likeCount || defaultLikeReaction) &&
                setLikeCount((prevCount) =>
                  prevCount >= likeReactionCount ? prevCount - 1 : 0
                );
              action === "DISLIKE"
                ? mutateDislikeFunc({ id: reviewId, type: action })
                : mutateUnlikeFunc({ id: reviewId, type: action });
            }}
            count={dislikeCount}
          />
        </div>
      </div>
    </>
  );
}
