"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/widget/DataTable";
import { PaginationMetadata } from "@/lib/paginator";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { FC, useMemo } from "react";

export const UserTable: FC<{
  users: User[];
  meta: PaginationMetadata;
}> = ({ users, meta }) => {
  const router = useRouter();

  const columns: ColumnDef<User>[] = useMemo(
    (): ColumnDef<User>[] => [
      {
        id: "number",
        accessorFn: (_, index) => index,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              No.
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div>{meta.perPage * (meta.currentPage - 1) + row.index + 1}</div>
        ),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Nama
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Email
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.original.email}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "role",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Role
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.original.role}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "updated_at",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Diupdate pada
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.original.updated_at.toTimeString()}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        id: "actions",
        header: ({}) => {
          return <Button variant="ghost">Aksi</Button>;
        },
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    router.push(`/admin/user/${row.original.id}`);
                  }}
                >
                  <Pencil />
                  <span>Edit</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        enableHiding: false,
      },
    ],
    [meta, router],
  );

  return (
    <DataTable
      data={users}
      columns={columns}
      createPath="/admin/user/add"
      filterPlaceholder="Filter by nama"
    />
  );
};
