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

import { AmenitiesType } from "./columns";
import DeleteAmenity from "./modals/delete";

export function AmenitiesRowActions<TData>({
  row,
}: {
  row: Row<AmenitiesType[number]>;
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
      {/* <ViewArea
        onOpen={onOpenView}
        onClose={onCloseView}
        isOpen={isOpenView}
        data={row.original}
      /> */}
      <DeleteAmenity
        onOpen={onOpenDelete}
        onClose={onCloseDelete}
        isOpen={isOpenDelete}
        data={row.original}
      />
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => onOpenView()}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/amenities/${id}`)}>
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
