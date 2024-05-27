"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { RouterOutputs } from "@repo/api";
import { Checkbox, DataTableColumnHeader, DataTableRowActions } from "@repo/ui";
import { DATE_CREATED_AT_FORMAT } from "@repo/utils";

import { AmenitiesRowActions } from "./row-actions";

export type AmenitiesType = RouterOutputs["amenity"]["findAll"]["data"];

export const amenitiesColumns: ColumnDef<AmenitiesType[number]>[] = [
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
      <DataTableColumnHeader column={column} title="Amenities" />
    ),
    cell: ({ row }) => (
      <div className="line-clamp-1 w-[80px]">{row.getValue("name")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
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
    accessorKey: "category.name",
    id: "category.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categories" />
    ),
    cell: ({ row }) => (
      <div className="line-clamp-1 w-[80px]">
        {row.getValue("category.name")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "_count.reviews",
    id: "_count.reviews",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No. of Reviews" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("_count.reviews")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row}>
        {<AmenitiesRowActions row={row} />}
      </DataTableRowActions>
    ),
  },
];
