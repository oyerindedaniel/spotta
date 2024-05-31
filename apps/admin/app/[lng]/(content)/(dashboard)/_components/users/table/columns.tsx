"use client";

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

import { userAuthService, userRole } from "./constants";
import { UsersRowActions } from "./row-actions";

export type UsersType = RouterOutputs["user"]["findAll"]["data"];

export const usersColumns: ColumnDef<UsersType[number]>[] = [
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
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Firstname" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("firstName")}</div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lastname" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("lastName")}</div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const items = userRole.find(
        (item) => item.value === row.getValue("role"),
      );

      if (!items) {
        return null;
      }

      return <Badge variant={items.variant}>{items.value}</Badge>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "isConfirmed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email Confrimation" />
    ),
    cell: ({ row }) => {
      const isConfirmed = row.getValue("isConfirmed");

      return (
        <Badge variant={isConfirmed ? "success" : "destructive"}>
          {isConfirmed ? "Confirmed" : "Not confirmed"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "authService",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Auth service" />
    ),
    cell: ({ row }) => {
      const items = userAuthService.find(
        (item) => item.value === row.getValue("authService"),
      );

      if (!items) {
        return null;
      }

      return <Badge variant={items.variant}>{items.value}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row}>
        {<UsersRowActions row={row} />}
      </DataTableRowActions>
    ),
  },
];
