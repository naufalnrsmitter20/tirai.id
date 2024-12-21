"use client";

import { deleteMaterial } from "@/actions/customProduct/materials";
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
import { formatRupiah } from "@/lib/utils";
import { Material } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { FC, useMemo } from "react";
import { toast } from "sonner";

export const MaterialTable: FC<{
  materials: Material[];
}> = ({ materials: categories }) => {
  const router = useRouter();

  const columns: ColumnDef<Material>[] = useMemo(
    (): ColumnDef<Material>[] => [
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
        cell: ({ row }) => <div>{row.index + 1}</div>,
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
              Nama Material
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "price",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Harga
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{formatRupiah(row.getValue("price"))}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "supplier_price",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Harga Supplier
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div>{formatRupiah(row.getValue("supplier_price"))}</div>
        ),
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
                    router.push(`/admin/material/${row.original.id}`);
                  }}
                >
                  <Pencil />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    const loadingToast = toast.loading("Loading...");

                    const deleteArticleResult = await deleteMaterial(
                      row.original.id,
                    );
                    if (deleteArticleResult.error) {
                      return toast.error(deleteArticleResult.error.message, {
                        id: loadingToast,
                      });
                    }

                    return toast.success("Berhasil menghapus material!", {
                      id: loadingToast,
                    });
                  }}
                >
                  <Trash />
                  <span>Hapus</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        enableHiding: false,
      },
    ],
    [router],
  );

  return (
    <DataTable
      data={categories}
      columns={columns}
      createPath="/admin/material/add"
      filterPlaceholder="Filter by nama"
    />
  );
};
