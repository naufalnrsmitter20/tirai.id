"use client";

import { deleteModel } from "@/actions/customProduct/models";
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
import { Model } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { FC, useMemo } from "react";
import { toast } from "sonner";
export const ModelTable: FC<{
  models: Model[];
}> = ({ models }) => {
  const router = useRouter();

  const columns: ColumnDef<Model>[] = useMemo(
    (): ColumnDef<Model>[] => [
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
        accessorKey: "model",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Nama Model
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue("model")}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "description",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Deskripsi
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="line-clamp-1 max-w-sm">
            {row.getValue("description")}
          </div>
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
                    router.push(`/admin/model/${row.original.id}`);
                  }}
                >
                  <Pencil />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    const loadingToast = toast.loading("Loading...");

                    const deleteArticleResult = await deleteModel(
                      row.original.id,
                    );
                    if (deleteArticleResult.error) {
                      return toast.error(deleteArticleResult.error.message, {
                        id: loadingToast,
                      });
                    }

                    return toast.success("Berhasil menghapus model!", {
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
      data={models}
      columns={columns}
      createPath="/admin/model/add"
      columnSearch="model"
      filterPlaceholder="Filter by nama model"
    />
  );
};
