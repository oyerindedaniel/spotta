"use client";

import React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Icons } from "@/assets";
import { Area } from "@prisma/client";

import { useDisclosure } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";
import { UserDTO } from "@repo/types";
import {
  Button,
  CreateEditReview,
  ModalContainer,
  Review,
  Separator,
} from "@repo/ui";

import { AreaBySlug } from ".";

export default function AreaReviews({
  lng,
  area,
  session,
}: {
  lng: LanguagesType;
  area: AreaBySlug;
  session: UserDTO;
}) {
  const {
    isOpen: isOpenReview,
    onOpen: onOpenReview,
    onClose: onCloseReview,
  } = useDisclosure();

  const searchParams = useSearchParams();

  const reviewId = searchParams?.get("review");

  const { area: foundArea } = area ?? {};

  const { id: areaId, reviews, name } = foundArea;

  const filteredReviews = reviewId
    ? reviews.filter((review) => review.id !== reviewId)
    : reviews;

  return (
    <>
      <ModalContainer
        isOpen={isOpenReview}
        onClose={onCloseReview}
        title="Create Review"
      >
        <CreateEditReview
          lng={lng}
          type="create"
          intent="modal"
          areaId={areaId}
          onClose={onCloseReview}
        />
      </ModalContainer>
      <div>
        {filteredReviews && filteredReviews.length > 0 ? (
          <div>
            <div className="flex flex-col gap-6">
              {filteredReviews?.map((review, idx) => (
                <React.Fragment key={review.id}>
                  <Review
                    lng={lng}
                    review={{ ...review, area: {} as Area }}
                    session={session}
                  />
                  {idx !== reviews.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex flex-col items-center justify-center py-8">
            <Image
              src={Icons.emptyState}
              alt={`No review for area: ${name}`}
              className="mb-8"
            />
            <span className="mb-5 inline-block text-sm">
              Oops! No reviews yet.
            </span>
            <Button
              onClick={onOpenReview}
              type="button"
              className="uppercase"
              variant="outline"
            >
              Leave a review
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
