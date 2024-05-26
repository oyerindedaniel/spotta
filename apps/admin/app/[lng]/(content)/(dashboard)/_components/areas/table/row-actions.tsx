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

import { AreasType } from "./columns";
import { ViewArea } from "./modals/view";

export function AreasRowActions<TData>({
  row,
}: {
  row: Row<AreasType[number]>;
}) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const router = useRouter();

  const { id } = row.original;

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
        <DropdownMenuItem onClick={() => router.push(`/areas/${id}`)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </>
  );
}
