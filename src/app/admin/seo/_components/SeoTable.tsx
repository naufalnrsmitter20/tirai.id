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
import { SEO } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { FC, useMemo } from "react";

export const SEOTable: FC<{
  seoData: SEO[];
  meta: PaginationMetadata;
}> = ({ seoData, meta }) => {
  const router = useRouter();

  const columns: ColumnDef<SEO>[] = useMemo(
    (): ColumnDef<SEO>[] => [
      {
        id: "name",
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
        accessorKey: "page",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Halaman
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue("page")}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "title",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Judul
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.original.title}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "keywords",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Keywords
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div>
            {Array.isArray(row.original.keywords) 
              ? row.original.keywords.join(", ") 
              : "No keywords available"}
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: true,
      },
      {
        accessorKey: "updatedAt",
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
        cell: ({ row }) => (
          <div>{new Date(row.original.updatedAt).toLocaleString()}</div>
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
                    router.push(`/admin/seo/${row.id+1}`);
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
    [meta, router]
  );
  

  return (
    <DataTable
      data={seoData}
      columns={columns}
      createPath="/admin/seo/add"
      filterPlaceholder="Filter by halaman"
    />
  );
};
