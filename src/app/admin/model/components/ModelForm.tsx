"use client";

import { upsertModel } from "@/actions/customProduct/models";
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
import { Textarea } from "@/components/ui/textarea";
import { useZodForm } from "@/hooks/use-zod-form";
import { Model } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function ModelForm({ updateData }: { updateData?: Model }) {
  const router = useRouter();
  const upsertModelSchema = useMemo(
    () =>
      z.object({
        model: z.string().min(1, "Nama model wajib diisi."),
        description: z.string().min(1, "Deskripsi wajib diisi."),
      }),
    [],
  );

  const [loading, setLoading] = useState(false);
  const form = useZodForm({
    defaultValues: {
      model: updateData?.model || "",
      description: updateData?.description || "",
    },
    schema: upsertModelSchema,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);

    const loading = toast.loading(
      updateData ? "Memperbarui model..." : "Menambahkan model...",
    );

    try {
      const upsertCategoryResult = await upsertModel({
        id: updateData?.id,
        ...values,
      });
      if (!upsertCategoryResult.success) {
        setLoading(false);
        return toast.error(
          updateData ? "Gagal memperbarui model!" : "Gagal menambahkan model!",
          { id: loading },
        );
      }
      setLoading(false);
      toast.success(
        updateData
          ? "Berhasil memperbarui model!"
          : "Berhasil menambahkan model!",
        { id: loading },
      );
      return router.push("/admin/model");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setLoading(false);
      return toast.error(
        updateData ? "Gagal memperbarui model!" : "Gagal menambahkan model!",
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
            <>Edit model {updateData.model}</>
          ) : (
            <>Buat model Baru</>
          )}
        </H2>
      </div>

      <form onSubmit={onSubmit} className="max-w-screen-lg space-y-8">
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="model">Nama Model</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan nama model" />
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
              <FormLabel htmlFor="description">Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[120px]"
                  placeholder="Masukkan deskripsi model "
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
