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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/widget/DataTable";
import { PaginationMetadata } from "@/lib/paginator";
import { SEO } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { FC, useState } from "react";
import { deleteSeoPageById } from "@/actions/seo";
import { toast } from "sonner";

interface SeoTableProps {
  seoData: SEO[];
  meta: PaginationMetadata;
}

const createColumns = (
  meta: PaginationMetadata,
  router: ReturnType<typeof useRouter>,
  openDeleteDialog: (id: number) => void,
): ColumnDef<SEO>[] => [
  {
    id: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="whitespace-nowrap"
      >
        No.
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>{meta.perPage * (meta.currentPage - 1) + row.index + 1}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "page",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="whitespace-nowrap"
      >
        Halaman
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="whitespace-nowrap"
      >
        Judul
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "keywords",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="whitespace-nowrap"
      >
        Keywords
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">
        {row.original.keywords.length > 0
          ? row.original.keywords.join(", ")
          : "No Keywords"}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="whitespace-nowrap"
      >
        Diupdate pada
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {new Date(row.original.updatedAt).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <DropdownMenu modal={false}>
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
            onClick={() => router.push(`/admin/seo/${row.original.id}`)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openDeleteDialog(row.original.id)}
            className="flex items-center gap-2 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableHiding: false,
  },
];

export const SEOTable: FC<SeoTableProps> = ({ seoData, meta }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedSeoId, setSelectedSeoId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    if (!selectedSeoId) return;

    try {
      setIsDeleting(true);
      const response = await deleteSeoPageById(selectedSeoId);

      if (!response.success) {
        throw new Error(response.error?.message || "Failed to delete SEO page");
      }

      toast.success("SEO page berhasil dihapus");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus SEO page",
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setSelectedSeoId(null);
    }
  };

  const openDeleteDialog = (id: number) => {
    setSelectedSeoId(id);
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    if (!isDeleting) {
      setShowDeleteDialog(false);
      setSelectedSeoId(null);
    }
  };

  const columns = createColumns(meta, router, openDeleteDialog);

  return (
    <>
      <DataTable
        data={seoData}
        columns={columns}
        createPath="/admin/seo/add"
        filterPlaceholder="Filter berdasarkan halaman..."
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent onEscapeKeyDown={closeDeleteDialog}>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus SEO Page</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus SEO page ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={closeDeleteDialog}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
