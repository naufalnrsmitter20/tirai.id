"use client";

import { updateCustomRequest } from "@/utils/database/customRequest.query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { H3 } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useZodForm } from "@/hooks/use-zod-form";
import { CustomRequest } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";

interface Courier {
  code: string;
  description: string;
}

interface CustomRequestFormProps {
  updateData: CustomRequest & { user: { email: string } };
  courierList: Courier[];
}

const customRequestSchema = z.object({
  material: z.string().min(1, "Material wajib diisi"),
  model: z.string().min(1, "Model wajib diisi"),
  width: z.string().min(1, "Lebar wajib diisi"),
  height: z.string().min(1, "Tinggi wajib diisi"),
  price: z.number().min(0, "Harga tidak boleh negatif"),
  shipping_price: z
    .number()
    .min(0, "Ongkos kirim tidak boleh negatif")
    .nullable()
    .optional(),
  address: z.string().min(1, "Alamat wajib diisi"),
  recipient_name: z.string().min(1, "Nama penerima wajib diisi"),
  recipient_phone_number: z
    .string()
    .min(1, "Nomor penerima wajib diisi")
    .regex(/^(?:\+62|62|0)[2-9]\d{7,14}$/, "Nomor telepon tidak valid"),
  carrier_code: z.string().min(1, "Kurir wajib dipilih"),
  is_vat: z.boolean(),
  is_custom_carrier: z.boolean(),
  quantity: z.number().min(1),
});

type CustomRequestFormValues = z.infer<typeof customRequestSchema>;

export default function CustomRequestForm({
  updateData,
  courierList,
}: Readonly<CustomRequestFormProps>) {
  const router = useRouter();

  const form = useZodForm({
    defaultValues: {
      material: updateData.material,
      model: updateData.model,
      width: updateData.width,
      height: updateData.height,
      price: updateData.price,
      shipping_price: updateData.shipping_price,
      address: updateData.address,
      carrier_code: updateData.carrier_code || "",
      recipient_name: updateData.recipient_name,
      recipient_phone_number: updateData.recipient_phone_number,
      is_vat: updateData.is_vat ?? false,
      is_custom_carrier: updateData.is_custom_carrier ?? false,
      quantity: updateData.quantity,
    },
    schema: customRequestSchema,
  });

  const handleSubmit = async (values: CustomRequestFormValues) => {
    const loadingToast = toast.loading("Memperbarui data Custom Request...");

    try {
      await updateCustomRequest({ id: updateData.id }, values);

      toast.success("Berhasil memperbarui data Custom Request", {
        id: loadingToast,
      });
      router.refresh();
    } catch (error) {
      toast.error(
        `Gagal memperbarui data Custom Request: ${(error as Error).message}`,
        { id: loadingToast },
      );
    }
  };

  return (
    <Form {...form}>
      <div className="mb-5 flex items-center gap-4">
        <Button
          variant="link"
          size="link"
          onClick={() => router.push("/admin/custom-products")}
          type="button"
        >
          <ArrowLeft /> Kembali
        </Button>
        <H3 className="text-black">
          Edit Custom Request - {updateData.user.email}
        </H3>
      </div>

      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="max-w-screen-lg space-y-8"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Masukkan jenis material" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Masukkan model" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lebar</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Lebar" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tinggi</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Tinggi" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Satuan</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="Masukkan harga"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_vat"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel htmlFor="is_vat">Kenakan PPN (11%)</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      name={field.name}
                      onCheckedChange={(check) => {
                        form.setValue("is_vat", check as boolean);
                      }}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      id="is_vat"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Batang</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="Masukkan Jumlah"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="is_custom_carrier"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel htmlFor="is_custom_carrier">
                    Kurir Lainnya
                  </FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      name={field.name}
                      onCheckedChange={(check) => {
                        form.setValue("is_custom_carrier", check as boolean);
                      }}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      id="is_custom_carrier"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipping_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ongkos Kirim</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || null)
                      }
                      placeholder="Masukkan ongkos kirim"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="carrier_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Ekspedisi</FormLabel>
                  {form.watch("is_custom_carrier") ? (
                    <Input {...field} placeholder="Masukkan Nama Kurir" />
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kurir pengiriman" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courierList.map((courier) => (
                          <SelectItem key={courier.code} value={courier.code}>
                            {courier.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Masukkan alamat" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipient_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Penerima</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Masukkan Nama Penerima" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipient_phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Penerima</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Masukkan Nomor Penerima" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Simpan Perubahan
        </Button>
      </form>
    </Form>
  );
}
