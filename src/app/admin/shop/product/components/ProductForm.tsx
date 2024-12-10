"use client";

import { removeProduct, upsertProduct } from "@/actions/products";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { H2 } from "@/components/ui/text";
import { useZodForm } from "@/hooks/use-zod-form";
import { ProductWithCategoryReviewsVariants } from "@/types/entityRelations";
import { ProductCategory } from "@prisma/client";
import { ArrowLeft, Trash } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const ProductForm = ({
  updateData,
  categories,
}: {
  updateData?: ProductWithCategoryReviewsVariants;
  categories: ProductCategory[];
}) => {
  const router = useRouter();

  const deleteProduct = async () => {
    setLoading(true);

    const loading = toast.loading("Menghapus Kategori...");

    try {
      const upsertProductResult = await removeProduct(updateData?.id!);

      if (!upsertProductResult.success) {
        setLoading(false);
        return toast.error("Gagal menghapus produk!", { id: loading });
      }

      setLoading(false);
      router.push("/admin/shop/product");
      toast.success("Berhasil menghapus produk!", { id: loading });
    } catch (e) {
      setLoading(false);
      return toast.error("Gagal menghapus produk!", { id: loading });
    }
  };

  const upsertProductSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, "Nama Product wajib diisi."),
        description: z.string().min(1, "Deskripsi wajib diisi."),
        slug: z.string().min(1, "Deskripsi wajib diisi."),
        category: z.string().min(1, "Kategori wajib diisi."),
      }),
    [updateData],
  );
  const [loading, setLoading] = useState(false);
  const form = useZodForm({
    defaultValues: {
      category: updateData ? updateData.category.id : undefined,
      description: updateData ? updateData.description : undefined,
      name: updateData ? updateData.name : undefined,
      slug: updateData ? updateData.slug : undefined,
    },
    schema: upsertProductSchema,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);

    const loading = toast.loading(
      updateData ? "Memperbarui Product..." : "Menambahkan Product...",
    );

    const { category, description, name, slug } = values;

    try {
      const upsertProductResult = await upsertProduct({
        data: {
          id: updateData ? updateData.id : undefined,
          category,
          description,
          name,
          slug,
        },
      });

      if (!upsertProductResult.success) {
        setLoading(false);
        return toast.error(
          updateData
            ? "Gagal memperbarui Product!"
            : "Gagal menambahkan Product!",
          { id: loading },
        );
      }

      setLoading(false);
      toast.success(
        updateData
          ? "Berhasil memperbarui Product!"
          : "Berhasil menambahkan Product!",
        { id: loading },
      );
      return router.push("/admin/shop/product");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setLoading(false);
      return toast.error(
        updateData
          ? "Gagal memperbarui Product!"
          : "Gagal menambahkan Product!",
        { id: loading },
      );
    }
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
              <>Edit Product {updateData.name}</>
            ) : (
              <>Buat Product Baru</>
            )}
          </H2>
          {updateData && (
            <div className="inline-flex w-full justify-end">
              <Button
                className="bg-red-500 hover:bg-red-700"
                disabled={loading}
                onClick={deleteProduct}
              >
                <Trash /> Hapus
              </Button>
            </div>
          )}
        </div>
      </div>
      <form onSubmit={onSubmit} className="max-w-screen-lg space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Nama Product</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan nama Product" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Deskripsi Product</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan Deskripsi Product" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Slug Product</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan Slug Product" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Kategori Product</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    const Value = value;
                    field.onChange(Value);
                  }}
                  value={field.value}
                  name={field.name}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((i) => (
                      <SelectItem value={i.id} key={i.id}>
                        {i.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
