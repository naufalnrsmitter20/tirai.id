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
import { Textarea } from "@/components/ui/textarea";
import { useZodForm } from "@/hooks/use-zod-form";
import { formatNumber, MAX_FILE_SIZE, parseNumberInput } from "@/lib/utils";
import { ProductWithCategoryReviewsVariants } from "@/types/entityRelations";
import { ProductCategory } from "@prisma/client";
import { ArrowLeft, Trash } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { PhotosPreview } from "./PhotosPreview";

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

    const loading = toast.loading("Menghapus produk...");

    try {
      const deleteProductResult = await removeProduct(updateData!.id);

      if (!deleteProductResult.success) {
        setLoading(false);
        return toast.error("Gagal menghapus produk!", { id: loading });
      }

      setLoading(false);
      toast.success("Berhasil menghapus produk!", { id: loading });
      return router.push("/admin/shop/product");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setLoading(false);
      return toast.error("Gagal menghapus produk!", { id: loading });
    }
  };

  const upsertProductSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, "Nama produk wajib diisi."),
        description: z.string().min(1, "Deskripsi wajib diisi."),
        slug: z.string().min(1, "Deskripsi wajib diisi."),
        category: z.string().min(1, "Kategori wajib diisi."),
        price: z.string().min(1, "Harga wajib diisi."),
        stock: z.string().min(1, "Stok wajib diisi."),
        weight: z.string().min(1, "Berat wajib diisi."),
        photos: updateData
          ? z
              .union([z.instanceof(FileList), z.undefined()])
              .refine(
                (files) =>
                  !files ||
                  Array.from(files).every(
                    (file) => file?.size <= MAX_FILE_SIZE,
                  ),
                "Ukuran maksimum setiap file adalah 5MB",
              )
              .refine((files) => !files || files.length < 5)
          : z
              .instanceof(FileList)
              .refine(
                (files) =>
                  Array.from(files).every(
                    (file) => file?.size <= MAX_FILE_SIZE,
                  ),
                "Ukuran maksimum setiap file adalah 5MB",
              )
              .refine((files) => files.length > 0 && files.length < 5),
      }),
    [updateData],
  );
  const [loading, setLoading] = useState(false);
  const form = useZodForm({
    defaultValues: {
      category: updateData?.category.id || "",
      description: updateData?.description || "",
      name: updateData?.name || "",
      slug: updateData?.slug || "",
      price: updateData?.price?.toString() || "",
      stock: updateData?.stock?.toString() || "",
      weight: updateData?.weight?.toString() || "",
    },
    schema: upsertProductSchema,
  });

  const images = form.watch("photos");

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);

    const loading = toast.loading(
      updateData ? "Memperbarui produk..." : "Menambahkan produk...",
    );

    const { category, description, name, slug, photos, price, stock, weight } =
      values;

    try {
      const photosData = new FormData();
      if (photos) {
        Array.from(photos).forEach((photo) =>
          photosData.append(`photos`, photo),
        );
      }

      const upsertProductResult = await upsertProduct({
        data: {
          id: updateData ? updateData.id : undefined,
          category,
          description,
          name,
          slug,
          price: parseNumberInput(price),
          stock: parseNumberInput(stock),
          weight: parseNumberInput(weight),
          photos: photos ? photosData : undefined,
        },
      });

      if (!upsertProductResult.success) {
        setLoading(false);
        return toast.error(
          updateData
            ? "Gagal memperbarui produk!"
            : "Gagal menambahkan produk!",
          { id: loading },
        );
      }

      setLoading(false);
      toast.success(
        updateData
          ? "Berhasil memperbarui produk!"
          : "Berhasil menambahkan produk!",
        { id: loading },
      );
      return router.push("/admin/shop/product");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setLoading(false);
      return toast.error(
        updateData ? "Gagal memperbarui produk!" : "Gagal menambahkan produk!",
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
              <>
                Edit Produk{" "}
                <span className="text-primary-900">
                  &quot;{updateData.name}&quot;
                </span>
              </>
            ) : (
              <>Buat Produk Baru</>
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
              <FormLabel htmlFor="name">Nama Produk</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan nama produk" />
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
              <FormLabel htmlFor="title">Deskripsi Produk</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[120px]"
                  placeholder="Masukkan Deskripsi Produk"
                />
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
              <FormLabel htmlFor="title">Kategori Produk</FormLabel>
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
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Slug Produk</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan slug produk" />
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
        <FormField
          control={form.control}
          name="photos"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="photos">Foto-foto produk (max. 4)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  multiple
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <PhotosPreview images={images} updateData={updateData} />
        <Button disabled={loading} type="submit" className="w-full">
          Simpan
        </Button>
      </form>
    </Form>
  );
};
