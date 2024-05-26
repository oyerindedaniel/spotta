"use client";

import { StarFilledIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { RouterOutputs } from "@repo/api";
import {
  Badge,
  Checkbox,
  DataTableColumnHeader,
  DataTableRowActions,
} from "@repo/ui";
import { DATE_CREATED_AT_FORMAT } from "@repo/utils";

import { reviewStatus } from "./constants";
import { ReviewsRowActions } from "./row-actions";

export type ReviewsType = RouterOutputs["review"]["findAll"]["data"];

export const reviewsColumns: ColumnDef<ReviewsType[number]>[] = [
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
    accessorKey: "area.name",
    id: "area.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Areas" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("area.name")}</div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "_count.likeReactions",
    id: "_count.likeReactions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Likes" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("_count.likeReactions")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "_count.dislikeReactions",
    id: "_count.dislikeReactions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dislikes" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("_count.dislikeReactions")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        <span className="flex items-center gap-1">
          <StarFilledIcon color="#fcc419" />
          {`${row.getValue("rating")}.0`}
        </span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Review" />
    ),
    cell: ({ row }) => (
      <div className="line-clamp-1 w-[80px]">{row.getValue("description")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = reviewStatus.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return <Badge variant={status.variant}>{status.value}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row}>
        {<ReviewsRowActions row={row} />}
      </DataTableRowActions>
    ),
  },
];
