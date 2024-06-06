"use client";

import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";

import { api } from "@repo/api/src/react";
import { useDisclosure, useSessionStore } from "@repo/hooks";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  useToast,
} from "@repo/ui";

import { UsersType } from "./columns";

export function UsersRowActions<TData>({
  row,
}: {
  row: Row<UsersType[number]>;
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

  const { id, isConfirmed } = row.original;

  const {
    data: { userId },
  } = useSessionStore();

  const updateConfrimation = api.user.updateConfrimation.useMutation({
    onSuccess: ({ data }) => {
      toast({
        variant: "success",
        description: `Successfully updated confirmation`,
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

  const mutateConfirmation = (confirm: boolean) => {
    updateConfrimation.mutate({ id, isConfirmed: confirm });
  };

  const isDisabled = updateConfrimation.isPending;

  return (
    <>
      <DropdownMenuContent align="end" className="w-[160px]">
        {/* <DropdownMenuItem onClick={() => {}}>View</DropdownMenuItem> */}

        <DropdownMenuItem
          onClick={() => router.push(`/users/create-user/${id}`)}
        >
          Edit
        </DropdownMenuItem>

        {/* {isReviewOwner && (
          <DropdownMenuItem onClick={() => onOpenDelete()}>
            Delete
          </DropdownMenuItem>
        )} */}
        <DropdownMenuSeparator />
        {isConfirmed ? (
          <DropdownMenuItem
            disabled={isDisabled}
            onClick={() => mutateConfirmation(false)}
          >
            Unconfirm
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            disabled={isDisabled}
            onClick={() => mutateConfirmation(true)}
          >
            Confirm
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </>
  );
}
