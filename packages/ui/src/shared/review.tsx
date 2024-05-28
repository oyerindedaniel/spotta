"use client";

import { StarFilledIcon } from "@radix-ui/react-icons";
import { RouterOutputs } from "@repo/api";
import { useDebounce } from "@repo/hooks/src/use-debounce";
import { useInitialRender } from "@repo/hooks/src/use-initial-render";
import { useSessionStore } from "@repo/hooks/src/use-session-store";
import { formatTimeAgo, getInitials } from "@repo/utils";
import {
  updateReviewDislikeReactionSchema,
  updateReviewLikeReactionSchema,
  updateReviewReactionSchema,
  updateReviewUnlikeReactionSchema,
} from "@repo/validations";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage, Badge } from "..";
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
  review: Review;
  mutateFunc: (data: ReviewReactionType) => void;
  mutateLikeFunc: (data: ReviewLikeReactionType) => void;
  mutateDislikeFunc: (data: ReviewDislikeReactionType) => void;
  mutateUnlikeFunc: (data: ReviewUnlikeReactionType) => void;
}

let count = 0;

export function Review(props: Props) {
  const {
    data: { userId },
  } = useSessionStore();

  const initialRenderComplete = useInitialRender();

  const {
    id: reviewId,
    createdBy,
    description,
    rating,
    amenities,
    likeReactions,
    dislikeReactions,
    _count,
  } = props.review;

  const { mutateFunc, mutateDislikeFunc, mutateLikeFunc, mutateUnlikeFunc } =
    props;

  const { firstName, lastName, picture, createdAt } = createdBy;

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

  const defaultReaction = defaultLikeReaction || defaultDislikeReaction || null;
  const [reaction, setReaction] = useState<ReviewReactionType["type"] | null>(
    defaultReaction
  );

  const debouncedReaction = useDebounce(reaction, 1500);

  const isLiked = reaction === "LIKE";

  const isDisliked = reaction === "DISLIKE";

  const [likeCount, setLikeCount] = useState(likeReactionCount);
  const [dislikeCount, setDislikeCount] = useState(dislikeReactionsCount);

  useEffect(() => {
    if (defaultReaction && initialRenderComplete) {
      setReaction(defaultReaction);
    }
  }, [initialRenderComplete]);

  // useEffect(() => {
  //   if (debouncedReaction) {
  //     mutateFunc({ id: reviewId, type: debouncedReaction });
  //   }
  // }, [debouncedReaction]);

  return (
    <div>
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
      <div className="flex gap-3 items-center mb-5">
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
              setDislikeCount((prevCount) => prevCount - 1);
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
              setLikeCount((prevCount) => prevCount - 1);
            action === "DISLIKE"
              ? mutateDislikeFunc({ id: reviewId, type: action })
              : mutateUnlikeFunc({ id: reviewId, type: action });
            // mutateFunc({ id: reviewId, type: action });
          }}
          count={dislikeCount}
        />
      </div>
    </div>
  );
}
