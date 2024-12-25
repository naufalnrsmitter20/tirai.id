import { getShipmentStatus } from "@/utils/couriers";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Body2, Body3, Body5, H2, H3, H4, H5 } from "@/components/ui/text";
import { formatDate } from "@/lib/utils";

export default async function OrderDetail({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const shipment = await prisma.shipment.findUnique({
    where: { order_id: id },
  });

  if (!shipment || !shipment.tracking_id) return notFound();

  const shipmentStatus = (
    await getShipmentStatus(shipment.carrier, shipment.tracking_id)
  )?.data;

  if (!shipmentStatus) return notFound();

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center text-black">
      <div className="w-[90%] rounded-lg bg-neutral-50 px-3 py-2 sm:w-[40%]">
        <H2 className="mb-4">Cek Resi Pengiriman</H2>
        <div className="mb-3 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="h-[80px] w-full rounded-md bg-neutral-200 px-3 py-2">
            <Body2>Nama Servis</Body2>
            <H3>{shipmentStatus.summary.courier}</H3>
          </div>
          <div className="h-[80px] w-full rounded-md bg-neutral-200 px-3 py-2">
            <Body2>Tanggal Pengiriman</Body2>
            <H3>{formatDate(new Date(shipmentStatus.summary.date))}</H3>
          </div>
          <div className="h-[136px] w-full rounded-md bg-neutral-200 px-3 py-2">
            <Body2 className="mb-1">Dari</Body2>
            <H4>{shipmentStatus.detail.shipper}</H4>
            <H5>
              {shipmentStatus.detail.origin.length > 35
                ? shipmentStatus.detail.origin.substring(0, 35)
                : shipmentStatus.detail.origin}
            </H5>
          </div>
          <div className="h-[136px] w-full rounded-md bg-neutral-200 px-3 py-2">
            <Body2 className="mb-1">Ke</Body2>
            <H4>{shipmentStatus.detail.receiver}</H4>
            <H5>
              {shipmentStatus.detail.destination.length > 35
                ? shipmentStatus.detail.destination.substring(0, 35)
                : shipmentStatus.detail.destination}
            </H5>
          </div>
        </div>
        <div className="w-full rounded-lg bg-neutral-50 px-3 py-2">
          <H3 className="mb-1">Riwayat</H3>
          <div className="flex w-full flex-col gap-2 rounded-md bg-white px-2 py-2">
            {shipmentStatus.history.map((i) => (
              <figure key={i.date} className="w-full">
                <Body3>{i.desc}</Body3>
                <Body5>{i.date}</Body5>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
