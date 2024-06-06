"use client";

import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";

import { useDisclosure } from "@repo/hooks";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@repo/ui";

import { AreasType } from "./columns";
import DeleteArea from "./modals/delete";
import { ViewArea } from "./modals/view";

export function AreasRowActions<TData>({
  row,
}: {
  row: Row<AreasType[number]>;
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
      <ViewArea
        onOpen={onOpenView}
        onClose={onCloseView}
        isOpen={isOpenView}
        data={row.original}
      />
      <DeleteArea
        onOpen={onOpenDelete}
        onClose={onCloseDelete}
        isOpen={isOpenDelete}
        data={row.original}
      />
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => onOpenView()}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/areas/${id}`)}>
          View Reviews
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/areas/create-area/${id}`)}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onOpenDelete()}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </>
  );
}
