"use client";

import { deleteReferalAction } from "@/actions/referals";
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
import { ReferalWithUser } from "@/types/entityRelations";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { FC, useMemo } from "react";
import { toast } from "sonner";

export const ReferalTable: FC<{
  referals: ReferalWithUser[];
  meta: PaginationMetadata;
}> = ({ referals, meta }) => {
  const router = useRouter();

  const columns: ColumnDef<ReferalWithUser>[] = useMemo(
    (): ColumnDef<ReferalWithUser>[] => [
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
        id: "afiliator",
        accessorFn: ({ user }) => user.name,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Afiliator
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.original.user.name}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "code",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Kode
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue("code")}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "fee_in_percent",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Komisi
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue("fee_in_percent")}%</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "discount_in_percent",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Diskon
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.original.discount_in_percent}%</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        id: "actions",
        header: () => {
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
                    router.push(`/admin/referal/${row.original.id}`);
                  }}
                >
                  <Pencil />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    const data = { id: row.original.id };
                    const deleteReferal = await deleteReferalAction({ data });
                    if (!deleteReferal) {
                      toast.error("Gagal menghapus referal");
                    }
                    toast.success("Referal berhasil dihapus");
                    router.refresh();
                    return;
                  }}
                >
                  <Trash />
                  <span>delete</span>
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
      data={referals}
      columns={columns}
      createPath="/admin/referal/add"
      filterPlaceholder="Filter by kode"
      columnSearch="code"
    />
  );
};
