"use client";

import { Button } from "@/components/ui/button";
import { Body3, H5 } from "@/components/ui/text";
import { buildShipmentAddressString } from "@/utils/build-shipment-address-string";
import { ShippingAddress } from "@prisma/client";
import { FC, useState } from "react";
import { EditAddressDialog } from "./EditAddressDialog";

export const AddressTable: FC<{ addresses: ShippingAddress[] }> = ({
  addresses,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress>();

  return (
    <>
      <div className="mb-5 flex flex-col gap-y-4 divide-y divide-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-500 pb-4 text-neutral-500">
          <H5>Penerima</H5>
          <H5>Alamat</H5>
        </div>
        {addresses.map((address) => (
          <div
            key={address.id}
            className="grid grid-cols-2 gap-x-8 py-6 text-neutral-500"
          >
            <Body3>{address.recipient_name}</Body3>
            <div className="block">
              <Body3>{buildShipmentAddressString(address)}</Body3>
              <Button
                variant={"link"}
                className="p-0"
                onClick={() => {
                  setSelectedAddress(address);
                  setDialogOpen(true);
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button
        variant={"default"}
        className="w-full"
        onClick={() => setDialogOpen(true)}
      >
        Tambah
      </Button>
      <EditAddressDialog
        open={dialogOpen}
        setIsOpen={setDialogOpen}
        address={selectedAddress}
      />
    </>
  );
};
