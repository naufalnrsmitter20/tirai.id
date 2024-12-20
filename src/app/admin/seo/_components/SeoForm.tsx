"use client";

import { updateSeoById } from "@/actions/seo";
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
import { Textarea } from "@/components/ui/textarea";
import { H2 } from "@/components/ui/text";
import { useZodForm } from "@/hooks/use-zod-form";
import { SEO } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function SEOForm({ updateData }: { updateData?: SEO }) {
  const router = useRouter();
  const createSEOSchema = useMemo(
    () =>
      z.object({
        page: z.string().min(1, "Page wajib diisi."),
        title: z.string().min(1, "Title wajib diisi."),
        description: z.string().min(1, "Description wajib diisi."),
        keywords: z.array(z.string().min(1, "Keywords wajib diisi.")),
        canonicalURL: z.string().optional(),
        ogTitle: z.string().optional(),
        ogDescription: z.string().optional(),
        ogImage: z
          .instanceof(File)
          .refine((file) => file.type.startsWith("image/"), {
            message: "File harus berupa gambar.",
          })
          .optional(),
        twitterCard: z.string().optional(),
        twitterTitle: z.string().optional(),
        twitterDescription: z.string().optional(),
        twitterImage: z
          .instanceof(File)
          .refine((file) => file.type.startsWith("image/"), {
            message: "File harus berupa gambar.",
          })
          .optional(),
      }),
    [],
  );

  const [loading, setLoading] = useState(false);
  const form = useZodForm({
    defaultValues: {
      page: updateData?.page || "",
      title: updateData?.title || "",
      description: updateData?.description || "",
      keywords: updateData?.keywords || [],
      canonicalURL: updateData?.canonicalURL || "",
      ogTitle: updateData?.ogTitle || "",
      ogDescription: updateData?.ogDescription || "",
      twitterCard: updateData?.twitterCard || "",
      twitterTitle: updateData?.twitterTitle || "",
      twitterDescription: updateData?.twitterDescription || "",
    },

    schema: createSEOSchema,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);

    const loadingToast = toast.loading(
      updateData ? "Memperbarui data SEO..." : "Menambahkan data SEO...",
    );

    try {
      const data = new FormData();
      for (const key in values) {
        data.append(key, values[key]);
      }
      const upsertSEOResult = await updateSeoById(
        updateData?.id || null,
        data,
        values.keywords,
      );

      if (!upsertSEOResult) {
        setLoading(false);
        return toast.error(
          updateData
            ? "Gagal memperbarui data SEO!"
            : "Gagal menambahkan data SEO!" + updateData,
          { id: loadingToast },
        );
      }

      setLoading(false);
      return toast.success(
        updateData
          ? "Berhasil memperbarui data SEO!"
          : "Berhasil menambahkan data SEO!",
        { id: loadingToast },
      );
    } catch (e) {
      setLoading(false);
      return toast.error(
        updateData
          ? `Gagal memperbarui data SEO! ${(e as Error).message}`
          : "Gagal menambahkan data SEO!" + (e as Error).message,
        { id: loadingToast },
      );
    }
  });

  return (
    <Form {...form}>
      {updateData && (
        <div className="mb-5 flex items-center gap-4">
          <Button
            variant="link"
            size="link"
            onClick={() => router.back()}
            type="button"
          >
            <ArrowLeft /> Kembali
          </Button>
          <H2 className="text-black">Edit SEO untuk {updateData.page}</H2>
        </div>
      )}
      <form onSubmit={onSubmit} className="max-w-screen-lg space-y-8">
        <FormField
          control={form.control}
          name="page"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan nama halaman" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan title halaman" />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Masukkan deskripsi halaman" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={(field.value as string[]).join(", ")}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value
                        .split(",")
                        .map((keyword) => keyword.trim()),
                    )
                  }
                  placeholder="Masukkan keywords, pisahkan dengan koma"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="canonicalURL"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Canonical URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  readOnly
                  placeholder="Masukkan canonical URL"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ogTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OG Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan OG title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ogDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OG Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Masukkan OG description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ogImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OG Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                  placeholder="Upload OG image"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="twitterTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan Twitter title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="twitterDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Masukkan Twitter description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="twitterImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                  placeholder="Upload Twitter image"
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
