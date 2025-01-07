import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Body3, H2, H3 } from "@/components/ui/text";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { getShipmentStatus } from "@/utils/couriers";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function OrderDetail({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const shipment = await prisma.shipment.findUnique({
    where: { order_id: id },
  });

  if (!shipment || !shipment.tracking_id || shipment.is_custom_carrier)
    return notFound();

  const shipmentStatus = (
    await getShipmentStatus(shipment.carrier, shipment.tracking_id)
  )?.data;

  if (!shipmentStatus) return notFound();

  return (
    <div className="container mx-auto min-h-[70vh] max-w-3xl px-4 py-6">
      <Card className="w-full">
        <CardHeader>
          <Link
            className={buttonVariants({ variant: "link", size: "link" })}
            href={"/account/order-history"}
          >
            <ArrowLeft /> Kembali
          </Link>
          <H2 className="font-bold">Cek Resi Pengiriman</H2>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Shipment Summary */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="bg-slate-50">
              <CardContent className="pt-6">
                <div className="space-y-1">
                  <span className="text-sm text-slate-500">Nama Servis</span>
                  <Body3 className="text-lg font-semibold">
                    {shipmentStatus.summary.courier}
                  </Body3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50">
              <CardContent className="pt-6">
                <div className="space-y-1">
                  <span className="text-sm text-slate-500">
                    Tanggal Pengiriman
                  </span>
                  <Body3 className="text-lg font-semibold">
                    {formatDate(new Date(shipmentStatus.summary.date))}
                  </Body3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="bg-slate-50">
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-500">Dari</span>
                </div>
                <div className="space-y-1">
                  <Body3 className="font-medium">
                    {shipmentStatus.detail.shipper}
                  </Body3>
                  <Body3 className="text-sm text-slate-600">
                    {shipmentStatus.detail.origin.length > 35
                      ? `${shipmentStatus.detail.origin.substring(0, 35)}...`
                      : shipmentStatus.detail.origin}
                  </Body3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50">
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-500">Ke</span>
                </div>
                <div className="space-y-1">
                  <Body3 className="font-medium">
                    {shipmentStatus.detail.receiver}
                  </Body3>
                  <Body3 className="text-sm text-slate-600">
                    {shipmentStatus.detail.destination.length > 35
                      ? `${shipmentStatus.detail.destination.substring(
                          0,
                          35,
                        )}...`
                      : shipmentStatus.detail.destination}
                  </Body3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tracking History */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <H3 className="font-semibold">Riwayat Pengiriman</H3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipmentStatus.history.map((event, index) => (
                  <div
                    key={event.date}
                    className="relative flex gap-4 pb-4 pl-6 last:pb-0"
                  >
                    {index !== shipmentStatus.history.length - 1 && (
                      <div className="absolute left-[0.6rem] top-3 h-full w-px bg-slate-200" />
                    )}
                    <div className="absolute left-0 top-2 h-3 w-3 rounded-full bg-blue-500" />
                    <div className="flex-1 space-y-1">
                      <Body3 className="text-sm">{event.desc}</Body3>
                      <Body3 className="text-xs text-slate-500">
                        {event.date}
                      </Body3>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
