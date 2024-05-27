"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import GroupedAmenities from "@/components/group-amenities";
import { format } from "date-fns";

import { api } from "@repo/trpc/src/react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from "@repo/ui";

import { AreasType } from "../columns";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data: AreasType[number];
}

export function ViewArea({ isOpen, onOpen, onClose, data }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const { id, name, state, lga, createdAt, views, _count, medias } = data ?? {};

  const { medias: mediaCount, reviews: reviewCount } = _count ?? {};

  const {
    isPending,
    isError,
    data: groupAmenitiesData,
  } = api.area.groupAmenityByAreaId.useQuery(
    { areaId: id },
    {
      enabled: isOpen,
    },
  );

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            <div>
              <span className="mr-2 inline-block text-2xl capitalize">{`${name}, ${state}`}</span>{" "}
              <span className="text-xl font-medium">{`(${lga} LGA)`}</span>
            </div>
          </DialogTitle>
          <DialogDescription>
            <div className="flex gap-3">
              {createdAt && (
                <span>
                  Created {format(new Date(createdAt!), "MMMM do',' yyyy")}
                </span>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="text-sm">
            <div className="mr-4 inline-block">
              <span className="font-semibold">{`${views}`}</span> Views
            </div>
            <div className="inline-block">
              <span className="font-semibold">{`${reviewCount}`}</span> Reviews
            </div>
          </div>
          <div className="mt-4 text-sm">
            {isPending ? (
              <span>loading amenities...</span>
            ) : isError ? (
              <span>Error occurred</span>
            ) : (
              groupAmenitiesData && (
                // <ScrollArea className="h-24 w-full rounded-md border">
                <GroupedAmenities groupedAmenities={groupAmenitiesData.data} />
                // </ScrollArea>
              )
            )}
          </div>
          <div className="mt-4">
            <span className="mb-2 inline-block text-xs font-medium">
              {mediaCount} image(s)
            </span>
            <div className="flex flex-wrap gap-4">
              {medias.map((media) => (
                <div key={media.id} className="relative h-20 w-20">
                  <Image
                    src={media.src}
                    alt="image"
                    className="rounded-lg object-cover"
                    fill
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="flex gap-4">
          <Button className="w-2/4" type="button">
            View Reviews
          </Button>
          <Button
            onClick={() => router.push(`areas/create-area/${id}`)}
            className="w-2/4"
            type="button"
            variant="outline"
          >
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
