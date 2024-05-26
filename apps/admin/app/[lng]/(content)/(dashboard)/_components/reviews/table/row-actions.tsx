"use client";

import { useRouter } from "next/navigation";
import { ReviewStatus } from "@prisma/client";
import { Row } from "@tanstack/react-table";

import { useDisclosure } from "@repo/hooks/src/use-disclosure";
import { api } from "@repo/trpc/src/react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  useToast,
} from "@repo/ui";

import { ReviewsType } from "./columns";

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

  const { id, status } = row.original;

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
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => onOpenView()}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/areas/${id}`)}>
          Edit
        </DropdownMenuItem>
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
