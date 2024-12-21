"use client";

import { removeCategory } from "@/actions/categories";
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
import { formatDate } from "@/lib/utils";
import { ProductCategoryWithProductIds } from "@/types/entityRelations";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { FC, useMemo, useState } from "react";
import { toast } from "sonner";

export const CategoryTable: FC<{
  categories: ProductCategoryWithProductIds[];
}> = ({ categories }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const deleteCategory = async (id: string) => {
    setLoading(true);

    const loading = toast.loading("Menghapus Kategori...");

    try {
      const upsertProductResult = await removeCategory(id);

      if (!upsertProductResult.success) {
        setLoading(false);
        return toast.error(upsertProductResult.error?.message, { id: loading });
      }

      setLoading(false);
      toast.success("Berhasil menghapus kategori!", { id: loading });
    } catch {
      setLoading(false);
      return toast.error("Gagal menghapus kategori!", { id: loading });
    }
  };

  const columns: ColumnDef<ProductCategoryWithProductIds>[] = useMemo(
    (): ColumnDef<ProductCategoryWithProductIds>[] => [
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
              Nama Kategori
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "slug",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Slug
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue("slug")}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        id: "Diupdate pada",
        accessorKey: "updated_at",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Diupdate Pada
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{formatDate(row.original.updated_at)}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        id: "Jumlah Produk",
        accessorFn: (row) => row.products.length,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Jumlah Produk
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.original.products.length}</div>,
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
                    router.push(`/admin/shop/category/${row.original.id}`);
                  }}
                >
                  <Pencil />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    return await deleteCategory(row.original.id);
                  }}
                  disabled={loading}
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
      createPath="/admin/shop/category/add"
      filterPlaceholder="Filter by nama"
    />
  );
};
