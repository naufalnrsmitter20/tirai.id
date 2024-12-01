"use client";

import { upsertArticle } from "@/actions/articles";
import Editor from "@/components/editor/advanced-editor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { H2 } from "@/components/ui/text";
import { useZodForm } from "@/hooks/use-zod-form";
import { ArticleWithUser } from "@/types/entityRelations";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useMemo, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

const MAX_FILE_SIZE = 5_000_000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const ArticleForm: FC<{ updateData?: ArticleWithUser }> = ({
  updateData,
}: {
  updateData?: ArticleWithUser;
}) => {
  const router = useRouter();
  const createArticleSchema = useMemo(
    () =>
      z.object({
        title: z.string().min(1, "Judul artikel wajib diisi."),
        slug: z.string().min(1, "Slug wajib diisi."),
        tags: z
          .string()
          .transform((val) => val.split(", ").map((tag) => tag.trim()))
          .optional(),
        description: z.string().min(10, "Deskripsi minimal 10 karakter"),
        content: z.string().min(1, "Konten wajib diisi"),
        image: updateData
          ? z
              .instanceof(File)
              .optional()
              .refine((file: File | undefined) => {
                return (
                  file === undefined ||
                  ACCEPTED_IMAGE_TYPES.includes(file?.type)
                );
              }, "Hanya .jpeg, .png. yang valid")
              .refine((file: File | undefined) => {
                return file === undefined || file?.size <= MAX_FILE_SIZE;
              }, `Ukuran maksimal file adalah 5MB`)
          : z
              .instanceof(File)
              .refine((file: File) => {
                return ACCEPTED_IMAGE_TYPES.includes(file?.type);
              }, "Hanya .jpeg, .png. yang valid")
              .refine((file: File) => {
                return file?.size <= MAX_FILE_SIZE;
              }, `Ukuran maksimal file adalah 5MB`),
        is_published: z.boolean(),
      }),
    [],
  );

  const [loading, setLoading] = useState(false);

  const form = useZodForm({
    defaultValues: {
      title: updateData?.title || "",
      slug: updateData?.slug || "",
      description: updateData?.description || "",
      // @ts-expect-error to display initial update data
      tags: updateData?.tags.join(", ") || [],
      content: updateData?.content || "",
      image: undefined,
      is_published: updateData?.is_published || false,
    },
    schema: createArticleSchema,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);

    const formData = new FormData();
    const loading = toast.loading(
      updateData ? "Memperbarui artikel..." : "Menambahkan artikel...",
    );

    try {
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("description", values.description);
      if (values.tags && values.tags.length > 0) {
        formData.append("tags", values.tags?.join(","));
      }
      formData.append("content", values.content);
      if (values.image) formData.append("image", values.image);
      formData.append("is_published", values.is_published.toString());
      formData.append("author_id", "1");

      const res = await upsertArticle({ data: formData, id: updateData?.id });

      if (!res.success) {
        setLoading(false);
        return toast.error(
          updateData
            ? "Gagal Memperbarui artikel!"
            : "Gagal menambahkan artikel!",
          { id: loading },
        );
      }

      setLoading(false);
      return toast.success(
        updateData
          ? "Berhasil Memperbarui artikel!"
          : "Berhasil menambahkan artikel!",
        { id: loading },
      );
    } catch (e) {
      setLoading(false);
      return toast.error(
        updateData
          ? "Gagal Memperbarui artikel!"
          : "Gagal menambahkan artikel!",
        { id: loading },
      );
    }
  });

  return (
    <Form {...form}>
      {updateData && (
        <div className="mb-5 flex items-center gap-4">
          <Button
            onClick={() => router.back()}
            className="inline-flex aspect-square items-center justify-center rounded-full p-3"
            type="button"
          >
            <ArrowLeft className="text-white" />
          </Button>
          <H2 className="text-black">Update artikel {updateData.slug}</H2>
        </div>
      )}
      <form onSubmit={onSubmit} className="max-w-screen-lg space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan judul artikel" />
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
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan slug artikel" />
              </FormControl>
              <FormDescription>
                Slug akan digunakan untuk URL artikel.
                {"(https://tirai.id/artikel/{slug})"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagar</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter tags, separated by commas"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Masukkan tagar dengan dipisahkan oleh koma (,)
                {`(e.g., "tech, news, programming")`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konten</FormLabel>
              <FormControl>
                <Editor {...field} initialValue={updateData?.content} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gambar Cover</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("image") ? (
          <div className="mt-4">
            <Image
              src={URL.createObjectURL(form.watch("image") as Blob)}
              width={300}
              height={200}
              alt="Cover Preview"
              className="max-h-64"
              unoptimized
            />
          </div>
        ) : updateData && updateData.cover_url ? (
          <div className="mt-4">
            <Image
              src={updateData.cover_url}
              width={300}
              height={200}
              alt="Cover Preview"
              className="max-h-64"
              unoptimized
            />
          </div>
        ) : null}
        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  color="#000000"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Status Publikasi</FormLabel>
                <FormDescription>
                  Centang kotak ini untuk memublikasikan artikel.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size={"lg"} disabled={loading}>
          Konfirmasi
        </Button>
      </form>
    </Form>
  );
};
