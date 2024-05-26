"use client";

import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";

import { useDisclosure } from "@repo/hooks/src/use-disclosure";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
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

  const { id } = row.original;

  return (
    <>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => onOpenView()}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/areas/${id}`)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onOpenDelete()}>
          Approve
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onOpenDelete()}>
          Decline
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </>
  );
}
