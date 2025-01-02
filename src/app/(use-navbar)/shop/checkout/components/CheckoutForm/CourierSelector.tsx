"use client";

import { Service } from "@/actions/shippingPrice/scraper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Body1, Body3 } from "@/components/ui/text";
import { formatRupiah } from "@/lib/utils";
import { getCouriers } from "@/utils/couriers";
import { ShippingAddress } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const CourierSelector = ({
  address,
  courier,
  weightInKg,
  setCourier,
}: {
  address: ShippingAddress;
  weightInKg: number;
  courier: Service | undefined;
  setCourier: Dispatch<SetStateAction<Service | undefined>>;
}) => {
  const [couriers, setCouriers] = useState<Service[]>();

  useEffect(() => {
    const init = async () => {
      const couriers = await getCouriers({
        originCity: process.env.NEXT_PUBLIC_ORIGIN_CITY as string,
        destinationCity:
          address.city.split(" ").length > 1
            ? address.city.split(" ")[1]
            : address.city,
        weightInKg,
      });

      if (couriers) {
        setCouriers(couriers.costs);
      }
    };

    init();
  }, [address, weightInKg]);

  return (
    <div className="w-full">
      <Body1 className="mb-4">Metode Pengiriman</Body1>
      <div className="flex w-full flex-col gap-2">
        {couriers !== undefined && (
          <Select
            onValueChange={(value) => {
              const courierCode = value.split("-")[0];
              const service = value.split("-")[1];
              setCourier(
                couriers.find(
                  (c) => c.code === courierCode && c.service === service,
                ),
              );
            }}
            value={courier ? courier.code + "-" + courier.service : undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue className="text-black" placeholder={"Pilih kurir"} />
            </SelectTrigger>
            <SelectContent>
              {couriers.map((c) => (
                <SelectItem
                  key={c.code + "-" + c.service}
                  value={c.code + "-" + c.service}
                >
                  {c.name} - {c.service} ({formatRupiah(c.price)}){" "}
                  {c.note ? `\n(${c.note})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {couriers === undefined && (
          <Body3 className="text-neutral-500">Loading...</Body3>
        )}
      </div>
    </div>
  );
};

export default CourierSelector;
