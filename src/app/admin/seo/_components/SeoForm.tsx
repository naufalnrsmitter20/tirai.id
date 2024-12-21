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
import { H3 } from "@/components/ui/text";
import { useZodForm } from "@/hooks/use-zod-form";
import { SEO } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

interface SEOFormProps {
  updateData?: SEO;
}

const createSEOSchema = z.object({
  page: z.string().min(1, "Path halaman wajib diisi"),
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  keywords: z.array(z.string().min(1, "Kata kunci wajib diisi")),
  canonicalURL: z.string().optional(),
  image: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), {
      message: "Berkas harus berupa gambar",
    })
    .optional(),
});

type SEOFormValues = z.infer<typeof createSEOSchema>;

export default function SEOForm({ updateData }: Readonly<SEOFormProps>) {
  const router = useRouter();

  const form = useZodForm({
    defaultValues: {
      page: updateData?.page ?? "",
      title: updateData?.title ?? "",
      description: updateData?.description ?? "",
      keywords: updateData?.keywords ?? [],
      image: undefined,
    },
    schema: createSEOSchema,
  });

  const handleSubmit = async (values: SEOFormValues) => {
    const loadingMessage = updateData
      ? "Memperbarui data SEO..."
      : "Menambahkan data SEO...";
    const loadingToast = toast.loading(loadingMessage);

    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      const result = await updateSeoById(
        updateData?.id ?? null,
        formData,
        values.keywords,
      );

      if (!result) {
        const errorMessage = updateData
          ? "Gagal memperbarui data SEO"
          : "Gagal menambahkan data SEO";
        toast.error(errorMessage, { id: loadingToast });
        return;
      }

      const successMessage = updateData
        ? "Berhasil memperbarui data SEO"
        : "Berhasil menambahkan data SEO";
      toast.success(successMessage, { id: loadingToast });
      if (!updateData) router.push(`/admin/seo/${result.data?.id}`);
    } catch (error) {
      const errorMessage = updateData
        ? `Gagal memperbarui data SEO: ${(error as Error).message}`
        : `Gagal menambahkan data SEO: ${(error as Error).message}`;
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  return (
    <Form {...form}>
      <div className="mb-5 flex items-center gap-4">
        <Button
          variant="link"
          size="link"
          onClick={() => "/admin/seo"}
          type="button"
        >
          <ArrowLeft /> Kembali
        </Button>
        {updateData && (
          <H3 className="text-black">Edit SEO untuk {updateData.page}</H3>
        )}
      </div>

      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="max-w-screen-lg space-y-8"
      >
        <FormField
          control={form.control}
          name="page"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Path Halaman</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Masukkan path halaman (contoh: /about)"
                />
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
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan judul halaman" />
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
              <FormLabel>Deskripsi</FormLabel>
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
              <FormLabel>Kata Kunci (optional)</FormLabel>
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
                  placeholder="Masukkan kata kunci, pisahkan dengan koma"
                />
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
              <FormLabel>Gambar Halaman (optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                  placeholder="Unggah gambar halaman"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Simpan
        </Button>
      </form>
    </Form>
  );
}
