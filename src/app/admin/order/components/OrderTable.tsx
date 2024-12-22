"use client";

import { ConfirmOrder } from "@/actions/order";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/widget/DataTable";
import { formatDate } from "@/lib/utils";
import { OrderWithItemsPaymentShipment } from "@/types/entityRelations";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CheckCircle,
  CircleHelp,
  MoreHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const OrderTable = ({
  orders,
}: {
  orders: OrderWithItemsPaymentShipment[];
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (orderId: string) => {
    setLoading(true);
    const loadingId = toast.loading("Konfirmasi Order...");

    await ConfirmOrder(orderId);
    setLoading(false);
    return toast.success("Berhasil Konfirmasi Order", {
      id: loadingId,
    });
  };

  const columns: ColumnDef<OrderWithItemsPaymentShipment>[] = useMemo(
    (): ColumnDef<OrderWithItemsPaymentShipment>[] => [
      {
        id: "id",
        accessorFn: (row) => row.id,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Order ID
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.original.id}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "date",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Tanggal Order
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{formatDate(row.original.created_at)}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "statusorder",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Status Order
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.original.status}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "status",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Status Pembayaran
              <ArrowUpDown size={16} />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.original.payment?.status}</div>,
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
                {row.original.payment?.status === "COMPLETED" &&
                  row.original.status === "PENDING" && (
                    <DropdownMenuItem
                      onClick={async () => {
                        await handleConfirm(row.original.id);
                      }}
                      disabled={loading}
                    >
                      <CheckCircle />
                      <span>Konfirmasi</span>
                    </DropdownMenuItem>
                  )}
                <DropdownMenuItem
                  onClick={() => {
                    router.push(`/admin/order/${row.original.id}`);
                  }}
                >
                  <CircleHelp />
                  <span>Detail</span>
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
      columns={columns}
      data={orders}
      filterPlaceholder="Filter by Id"
      columnSearch="id"
    />
  );
};
