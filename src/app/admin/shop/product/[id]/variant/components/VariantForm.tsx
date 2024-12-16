"use client";

import { upsertVariant } from "@/actions/productVariants";
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
import { H2 } from "@/components/ui/text";
import { useZodForm } from "@/hooks/use-zod-form";
import { formatNumber, parseNumberInput } from "@/lib/utils";
import { ProductVariant } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const VariantForm = ({
  updateData,
  productId,
}: {
  productId: string;
  updateData?: ProductVariant;
}) => {
  const router = useRouter();

  const upsertProductSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, "Nama varian wajib diisi."),
        width: z.string().min(1, "Panjang varian wajib diisi."),
        height: z.string().min(1, "Tinggi varian wajib diisi."),
        price: z.string().min(1, "Harga wajib diisi."),
        stock: z.string().min(1, "Stok wajib diisi."),
        weight: z.string().min(1, "Berat wajib diisi."),
      }),
    [],
  );
  const [loading, setLoading] = useState(false);
  const form = useZodForm({
    defaultValues: {
      name: updateData?.name || "",
      width: updateData?.width.toString() || "",
      height: updateData?.height.toString() || "",
      price: updateData?.price.toString() || "",
      stock: updateData?.stock.toString() || "",
      weight: updateData?.weight.toString() || "",
    },
    schema: upsertProductSchema,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);

    const loading = toast.loading(
      updateData ? "Memperbarui varian..." : "Menambahkan varian...",
    );

    const { name, width, height, price, stock, weight } = values;

    const upsertProductResult = await upsertVariant({
      data: {
        id: updateData ? updateData.id : undefined,
        name,
        width: parseNumberInput(width),
        height: parseNumberInput(height),
        price: parseNumberInput(price),
        stock: parseNumberInput(stock),
        weight: parseNumberInput(weight),
        productId,
      },
    });

    if (!upsertProductResult.success) {
      setLoading(false);
      return toast.error(
        updateData ? "Gagal memperbarui varian!" : "Gagal menambahkan varian!",
        { id: loading },
      );
    }

    setLoading(false);
    toast.success(
      updateData
        ? "Berhasil memperbarui varian!"
        : "Berhasil menambahkan varian!",
      { id: loading },
    );
    return router.push(`/admin/shop/product/${productId}/variant`);
  });

  return (
    <Form {...form}>
      <div className="mb-8 max-w-screen-lg space-y-8">
        <div className="mb-2 flex flex-col items-start gap-4">
          <Button
            variant={"link"}
            size={"link"}
            onClick={() => router.back()}
            type="button"
          >
            <ArrowLeft /> Kembali
          </Button>
          <H2 className="text-black">
            {updateData ? (
              <>Edit Varian {updateData.name}</>
            ) : (
              <>Buat Varian Baru</>
            )}
          </H2>
        </div>
      </div>
      <form onSubmit={onSubmit} className="max-w-screen-lg space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Nama Varian</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan nama varian" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="width"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="width">Lebar (cm)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    const formattedValue = formatNumber(e.target.value);
                    field.onChange(formattedValue);
                  }}
                  placeholder="Masukkan lebar"
                />
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
              <FormLabel htmlFor="height">Tinggi (cm)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    const formattedValue = formatNumber(e.target.value);
                    field.onChange(formattedValue);
                  }}
                  placeholder="Masukkan tinggi"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="price">Harga (Rp.)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    const formattedValue = formatNumber(e.target.value);
                    field.onChange(formattedValue);
                  }}
                  placeholder="Masukkan harga"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="stock">Stok</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    const formattedValue = formatNumber(e.target.value, true);
                    field.onChange(formattedValue);
                  }}
                  placeholder="Masukkan stok varian"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="weight">Berat (kg)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    const formattedValue = formatNumber(e.target.value, false);
                    field.onChange(formattedValue);
                  }}
                  placeholder="Masukkan berat varian"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit" className="w-full">
          Simpan
        </Button>
      </form>
    </Form>
  );
};
