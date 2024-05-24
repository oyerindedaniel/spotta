"use client";

import { Row } from "@tanstack/react-table";

import { useDisclosure } from "@repo/hooks/src/use-disclosure";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@repo/ui";

import { AreasType } from "./columns";
import { ViewArea } from "./modals/view";

export function AreasRowActions<TData>({
  row,
}: {
  row: Row<AreasType[number]>;
}) {
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <>
      <ViewArea
        onOpen={onOpen}
        onClose={onClose}
        isOpen={isOpen}
        data={row.original}
      />
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => {
            onOpen();
          }}
        >
          View
        </DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </>
  );
}
