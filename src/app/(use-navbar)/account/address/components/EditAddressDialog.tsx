"use client";

import { upsertAddress } from "@/actions/address";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useZodForm } from "@/hooks/use-zod-form";
import { DialogBaseProps } from "@/types/dialog";
import { ShippingAddress } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const createFieldTypeSchema = z.object({
  recipient_name: z.string().min(1, "Nama penerima wajib diisi"),
  recipient_phone_number: z
    .string()
    .min(1, "Nomor telepon penerima wajib diisi"),
  street: z.string().min(1, "Alamat jalan wajib diisi"),
  city: z.string().min(1, "Kota wajib diisi"),
  village: z.string().min(1, "Kelurahan/desa wajib diisi"),
  district: z.string().min(1, "Kecamatan wajib diisi"),
  province: z.string().min(1, "Provinsi wajib diisi"),
  postal_code: z.string().min(1, "Kode pos wajib diisi"),
  additional_info: z.string().optional(),
});

export const EditAddressDialog: FC<
  DialogBaseProps & { address?: ShippingAddress }
> = ({ open, setIsOpen, address }) => {
  const form = useZodForm({
    values: {
      recipient_name: address?.recipient_name || "",
      recipient_phone_number: address?.recipient_phone_number || "",
      street: address?.street || "",
      city: address?.city || "",
      village: address?.village || "",
      district: address?.district || "",
      province: address?.province || "",
      postal_code: address?.postal_code || "",
      additional_info: address?.additional_info || "",
    },
    schema: createFieldTypeSchema,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = form.handleSubmit(async (fields) => {
    setLoading(true);

    const loadingToast = toast.loading("Loading...");

    const upsertAdddressAction = await upsertAddress(fields, address?.id);
    if (upsertAdddressAction.error) {
      return toast.error("Gagal Menambahkan!", { id: loadingToast });
    }

    toast.success("Berhasil Menambahkan!", { id: loadingToast });
    form.reset();
    setLoading(false);
    setIsOpen(false);
    return router.refresh();
  });

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{address ? "Edit" : "Tambahkan"} Alamat</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="w-full">
            <div className="grid w-full gap-4 py-4">
              <FormField
                control={form.control}
                name="recipient_name"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="recipient_name">
                      Nama Penerima
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Masukkan nama penerima" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recipient_phone_number"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="recipient_phone_number">
                      Nomor Telepon Penerima (08xx-xxxx-xxxx)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numericValue = value.replace(/[^0-9]/g, "");
                          field.onChange(numericValue);
                        }}
                        placeholder="Masukkan nomor telepon penerima"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="street">Jalan</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Jl. Danau Ranau No. G6B" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="village"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="village">Kelurahan/Desa</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Sawojajar" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="district">Kecamatan</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Kedungkandang" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="city">
                      Kota/Kabupaten (Gunakan kota/kabupaten didepan nama)
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Kota Malang" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="province">Provinsi</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Jawa Timur" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="postal_code">Kode Pos</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="65139" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additional_info"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="additional_info">
                      Info Tambahan
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Di depan kios abc" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                variant={"default"}
                type="submit"
                className="mt-2 w-full"
                disabled={loading}
              >
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
