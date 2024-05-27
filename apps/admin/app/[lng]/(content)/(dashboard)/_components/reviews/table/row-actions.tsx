"use client";

import { useRouter } from "next/navigation";
import { ReviewStatus } from "@prisma/client";
import { Row } from "@tanstack/react-table";

import { useDisclosure } from "@repo/hooks/src/use-disclosure";
import { useSessionStore } from "@repo/hooks/src/use-session-store";
import { api } from "@repo/trpc/src/react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  useToast,
} from "@repo/ui";

import { ReviewsType } from "./columns";
import DeleteReview from "./modals/delete";

export function ReviewsRowActions<TData>({
  row,
}: {
  row: Row<ReviewsType[number]>;
}) {
  const {
    onOpen: onOpenView,
    onClose: onCloseView,
    isOpen: isOpenView,
  } = useDisclosure();

  const {
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
    isOpen: isOpenDelete,
  } = useDisclosure();

  const router = useRouter();
  const { toast } = useToast();

  const {
    id,
    status,
    createdBy: { id: createdById },
  } = row.original;

  const {
    data: { userId },
  } = useSessionStore();

  const isReviewOwner = userId === createdById;

  const updateStatus = api.review.updateStatus.useMutation({
    onSuccess: ({ data }) => {
      toast({
        variant: "success",
        description: `Successfully updated review status`,
      });
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error?.message,
      });
      router.refresh();
    },
  });

  const isDisabled = updateStatus.isPending;

  return (
    <>
      <DeleteReview
        onOpen={onOpenDelete}
        onClose={onCloseDelete}
        isOpen={isOpenDelete}
        data={row.original}
      />
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => onOpenView()}>View</DropdownMenuItem>
        {isReviewOwner && (
          <DropdownMenuItem
            onClick={() => router.push(`reviews/create-review/${id}`)}
          >
            Edit
          </DropdownMenuItem>
        )}
        {isReviewOwner && (
          <DropdownMenuItem onClick={() => onOpenDelete()}>
            Delete
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isDisabled || status === "PENDING"}
          onClick={() =>
            updateStatus.mutate({ id, status: ReviewStatus.PENDING })
          }
        >
          Pending
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isDisabled || status === "APPROVED"}
          onClick={() =>
            updateStatus.mutate({ id, status: ReviewStatus.APPROVED })
          }
        >
          Approve
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isDisabled || status === "DECLINED"}
          onClick={() =>
            updateStatus.mutate({ id, status: ReviewStatus.DECLINED })
          }
        >
          Decline
        </DropdownMenuItem>
      </DropdownMenuContent>
    </>
  );
}
