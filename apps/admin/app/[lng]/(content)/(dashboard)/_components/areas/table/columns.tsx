"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { RouterOutputs } from "@repo/api";
import { Checkbox, DataTableColumnHeader, DataTableRowActions } from "@repo/ui";
import { DATE_CREATED_AT_FORMAT } from "@repo/utils";

import { AreasRowActions } from "./row-actions";

export type AreasType = RouterOutputs["area"]["findAll"]["data"];

export const areasColumns: ColumnDef<AreasType[number]>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date created" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {format(row.getValue("createdAt"), DATE_CREATED_AT_FORMAT)}
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Areas" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "views",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Views" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("views")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "createdBy.firstName",
    id: "createdBy.firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created By" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("createdBy.firstName")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "_count.reviews",
    id: "_count.reviews",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reviews" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("_count.reviews")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "_count.medias",
    id: "_count.medias",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medias" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("_count.medias")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row}>
        {<AreasRowActions row={row} />}
      </DataTableRowActions>
    ),
  },
];
