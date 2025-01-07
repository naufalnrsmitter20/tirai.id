import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getServerSession } from "@/lib/next-auth";
import { formatDate, formatRupiah } from "@/lib/utils";
import { findOrderById } from "@/utils/database/order.query";
import { Calendar, FileText, TruckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AWBForm } from "./components/AWBForm";
import { ConfirmButton } from "./components/ConfirmButton";

export default async function OrderDetail({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const order = await findOrderById(id);
  const session = await getServerSession();

  if (
    !order ||
    (order.status === "APPROVED" &&
      session?.user?.role !== "PRODUCTION" &&
      session?.user?.role !== "SUPERADMIN") ||
    (order.status === "PRODUCING" &&
      session?.user?.role !== "PACKAGING" &&
      session?.user?.role !== "SUPERADMIN")
  )
    return notFound();

  const realTotalPrice = order.items.reduce((acc, i) => {
    return (acc += (i.product?.price ?? i.variant?.price ?? 0) * i.quantity);
  }, 0);

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      {/* Order Summary Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Detail Pesanan</h2>
            <p className="text-sm text-muted-foreground">Order #{order.id}</p>
          </div>
          <Badge
            variant={order.status === "FINISHED" ? "default" : "secondary"}
          >
            {order.status}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Tanggal: {formatDate(order.created_at)}
                </span>
              </div>
              {order.invoice_link && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href={order.invoice_link}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Invoice #{order.payment?.transaction_id}
                  </Link>
                </div>
              )}
            </div>
            {order.shipment && (
              <div className="flex items-center gap-2">
                <TruckIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Status Pengiriman: {order.shipment.status}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmButton order={order} role={session!.user!.role} />

      {/* Order Items Card */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Barang Pesanan</h3>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="rounded-lg border bg-card p-4">
                  {item.custom_request ? (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <h4 className="font-semibold">Custom Request</h4>
                        <span className="font-medium">
                          {formatRupiah(item.custom_request.price)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Bahan</p>
                          <p>{item.custom_request.material}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Model</p>
                          <p>{item.custom_request.model}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Ukuran</p>
                          <p>
                            {item.custom_request.width}cm x{" "}
                            {item.custom_request.height}cm
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <Image
                        alt={item.product?.name || "Product Image"}
                        src={item.product?.photos[0] || "/placeholder.png"}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex flex-1 justify-between">
                        <div>
                          <h4 className="font-semibold">
                            {item.product?.name}
                          </h4>
                          {item.variant && (
                            <p className="text-sm text-muted-foreground">
                              {item.variant.name}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            {item.quantity} x{" "}
                            {formatRupiah(
                              item.variant
                                ? item.variant.price
                                : item.product!.price!,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Order Total Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">
                Total Barang ({order.items?.length} Barang)
              </span>
              <span className="font-medium">
                {!order.items?.[0]?.custom_request
                  ? formatRupiah(realTotalPrice)
                  : formatRupiah(
                      order.total_price -
                        order.shipping_price -
                        (order.total_price -
                          order.shipping_price -
                          (order.total_price - order.shipping_price) / 1.11),
                    )}
              </span>
            </div>

            {!order.items?.[0]?.custom_request && (
              <div className="flex justify-between text-sm">
                <span>
                  Total Diskon (
                  {Math.round(
                    ((realTotalPrice -
                      (order.total_price - order.shipping_price) / 1.11) /
                      realTotalPrice) *
                      100,
                  )}
                  %)
                </span>
                <span className="text-red-600">
                  -
                  {formatRupiah(
                    realTotalPrice -
                      (order.total_price - order.shipping_price) / 1.11,
                  )}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span>PPN (11%)</span>
              <span>
                {formatRupiah(
                  order.total_price -
                    order.shipping_price -
                    (order.total_price - order.shipping_price) / 1.11,
                )}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Ongkos Kirim</span>
              <span>{formatRupiah(order.shipping_price)}</span>
            </div>

            <Separator />

            <div className="flex justify-between font-medium">
              <span>Total Pembayaran</span>
              <span className="text-lg">{formatRupiah(order.total_price)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AWBForm order={order} />
    </div>
  );
}
