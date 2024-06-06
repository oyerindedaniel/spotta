"use client";

import { RouterOutputs } from "@repo/api";
import { useDisclosure } from "@repo/hooks";
import { LanguagesType } from "@repo/i18n";
import { Badge, Button, CreateEditReview, ModalContainer } from "@repo/ui";

export default function AreaHeader({
  lng,
  area,
}: {
  lng: LanguagesType;
  area: RouterOutputs["area"]["findBySlug"]["data"];
}) {
  const {
    isOpen: isOpenReview,
    onOpen: onOpenReview,
    onClose: onCloseReview,
  } = useDisclosure();

  const { amenities, area: foundArea } = area ?? {};

  const { id: areaId, name, state, _count } = foundArea;

  const { reviews: reviewsCount } = _count;

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
      <div className="mb-3 bg-[#F2F6FD] px-6 pb-3 pt-6 dark:bg-[#242428] md:px-14">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-2xl font-medium">
              {name}, {state}
            </h2>
            <Button className="uppercase" onClick={() => onOpenReview()}>
              leave a review
            </Button>
          </div>
          <div className="mb-2.5 text-base">
            <span className="font-medium">"{reviewsCount}"</span>{" "}
            <span>Reviews</span>{" "}
            <span>(People are raving about the selected location)</span>
          </div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            {amenities.map((amenity) => (
              <Badge
                key={amenity.id}
                className="cursor-pointer"
                variant="default"
              >
                {amenity.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
