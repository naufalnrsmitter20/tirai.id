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
import { useZodForm } from "@/hooks/use-zod-form";
import { CustomRequest } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

interface CustomRequestFormProps {
  updateData: CustomRequest & { user: { email: string } };
}

const customRequestSchema = z.object({
  material: z.string().min(1, "Material wajib diisi"),
  model: z.string().min(1, "Model wajib diisi"),
  color: z.string().min(1, "Warna wajib diisi"),
  width: z.string().min(1, "Lebar wajib diisi"),
  height: z.string().min(1, "Tinggi wajib diisi"),
  price: z.number().min(0, "Harga tidak boleh negatif"),
  shipping_price: z
    .number()
    .min(0, "Ongkos kirim tidak boleh negatif")
    .nullable()
    .optional(),
  address: z.string().min(1, "Alamat wajib diisi"),
});

type CustomRequestFormValues = z.infer<typeof customRequestSchema>;

export default function CustomRequestForm({
  updateData,
}: Readonly<CustomRequestFormProps>) {
  const router = useRouter();

  const form = useZodForm({
    defaultValues: {
      material: updateData.material,
      model: updateData.model,
      color: updateData.color,
      width: updateData.width,
      height: updateData.height,
      price: updateData.price,
      shipping_price: updateData.shipping_price,
      address: updateData.address,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warna</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        {...field}
                        className="w-14 p-1 h-10"
                      />
                      <Input
                        {...field}
                        placeholder="Kode warna"
                        className="flex-1"
                      />
                    </div>
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
                  <FormLabel>Harga</FormLabel>
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
          </div>

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
        </div>

        <Button type="submit" className="w-full">
          Simpan Perubahan
        </Button>
      </form>
    </Form>
  );
}
