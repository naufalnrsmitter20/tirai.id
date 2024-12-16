"use client";

import { deleteVariant as removeVariant } from "@/actions/productVariants";
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
import { formatDate, formatNumber, formatRupiah } from "@/lib/utils";
import { ProductVariant } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { FC, useMemo } from "react";
import { toast } from "sonner";

export const VariantTable: FC<{
  productId: string;
  variants: ProductVariant[];
}> = ({ productId, variants }) => {
  const router = useRouter();

  const deleteVariant = async (id: string) => {
    const loading = toast.loading("Menghapus varian...");

    try {
      const upsertProductResult = await removeVariant(id);

      if (!upsertProductResult.success) {
        return toast.error(upsertProductResult.error?.message, { id: loading });
      }

      toast.success("Berhasil menghapus varian!", { id: loading });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return toast.error("Gagal menghapus varian!", { id: loading });
    }
  };

  const columns: ColumnDef<ProductVariant>[] = useMemo(
    (): ColumnDef<ProductVariant>[] => [
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
              Nama Varian
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
        id: "Size",
        accessorFn: (row) => row.width * row.height,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Ukuran
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div>
            {formatNumber(row.original.width.toString())}cm x{" "}
            {formatNumber(row.original.height.toString())}cm
          </div>
        ),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "weight",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Berat
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div>{formatNumber(row.original.weight.toString())}kg</div>
        ),
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
                    router.push(
                      `/admin/shop/product/${productId}/variant/${row.original.id}`,
                    );
                  }}
                >
                  <Pencil />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await deleteVariant(row.original.id);
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
      data={variants}
      columns={columns}
      createPath={`/admin/shop/product/${productId}/variant/add`}
      filterPlaceholder="Filter by nama"
    />
  );
};
