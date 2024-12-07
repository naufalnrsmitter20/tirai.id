"use client";

import { upsertMaterial } from "@/actions/customProduct/materials";
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
import { formatPrice } from "@/utils/format-price";
import { Material } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function MaterialForm({
  updateData,
}: {
  updateData?: Material;
}) {
  const router = useRouter();
  const upsertCategorySchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, "Nama material wajib diisi."),
        price: z.string().min(1, "Harga wajib diisi."),
        supplier_price: z.string().min(1, "Harga untuk supplier wajib diisi."),
      }),
    [],
  );

  const [loading, setLoading] = useState(false);
  const form = useZodForm({
    defaultValues: {
      name: updateData?.name || "",
      price: updateData?.price.toString() || "",
      supplier_price: updateData?.supplier_price.toString() || "",
    },
    schema: upsertCategorySchema,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);

    const loading = toast.loading(
      updateData ? "Memperbarui material..." : "Menambahkan material...",
    );

    try {
      const upsertCategoryResult = await upsertMaterial({
        id: updateData?.id,
        ...values,
      });
      if (!upsertCategoryResult.success) {
        setLoading(false);
        return toast.error(
          updateData
            ? "Gagal memperbarui material!"
            : "Gagal menambahkan material!",
          { id: loading },
        );
      }
      setLoading(false);
      toast.success(
        updateData
          ? "Berhasil memperbarui material!"
          : "Berhasil menambahkan material!",
        { id: loading },
      );
      return router.push("/admin/material");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setLoading(false);
      return toast.error(
        updateData
          ? "Gagal memperbarui material!"
          : "Gagal menambahkan material!",
        { id: loading },
      );
    }
  });

  return (
    <Form {...form}>
      <div className="mb-12 flex flex-col items-start gap-4">
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
            <>Edit Material {updateData.name}</>
          ) : (
            <>Buat Material Baru</>
          )}
        </H2>
      </div>

      <form onSubmit={onSubmit} className="max-w-screen-lg space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Nama Material</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan nama material" />
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
              <FormLabel htmlFor="price">Harga</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(formatPrice(e.target.value));
                  }}
                  placeholder="Masukkan harga material"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supplier_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="supplier_price">
                Harga untuk Supplier
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(formatPrice(e.target.value));
                  }}
                  placeholder="Masukkan harga material untuk supplier"
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
}
