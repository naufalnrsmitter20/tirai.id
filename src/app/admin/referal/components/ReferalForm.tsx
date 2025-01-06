"use client";

import { upsertReferal } from "@/actions/referals";
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
import { ReferalWithUser } from "@/types/entityRelations";
import { formatPrice, parsePrice } from "@/utils/format-price";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function ReferalForm({
  updateData,
  affiliators,
}: {
  updateData?: ReferalWithUser;
  affiliators: { id: string; name: string; email: string }[];
}) {
  const router = useRouter();
  const upsertReferalSchema = useMemo(
    () =>
      z.object({
        code: z.string().min(1, "Kode referal wajib diisi."),
        fee_in_percent: z.string().min(1, "Komisi wajib diisi."),
        discount_in_percent: z.string().min(1, "Komisi wajib diisi."),
        user_id: z.string().min(1, "Afiliator wajib diisi."),
      }),
    [],
  );
  const [loading, setLoading] = useState(false);
  const form = useZodForm({
    defaultValues: {
      code: updateData?.code || "",
      fee_in_percent: updateData?.fee_in_percent.toString() || "",
      discount_in_percent: updateData?.fee_in_percent.toString() || "",
      user_id: updateData?.user_id || "",
    },
    schema: upsertReferalSchema,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);

    const loading = toast.loading(
      updateData ? "Memperbarui referal..." : "Menambahkan referal...",
    );

    try {
      const upsertUserResult = await upsertReferal({
        data: {
          id: updateData?.id,
          code: values.code,
          discount_in_percent: parsePrice(values.discount_in_percent),
          fee_in_percent: parsePrice(values.fee_in_percent),
          user_id: values.user_id,
        },
      });

      if (!upsertUserResult.success) {
        setLoading(false);
        return toast.error(
          updateData ? "Gagal memperbarui user!" : "Gagal menambahkan user!",
          { id: loading },
        );
      }

      setLoading(false);
      toast.success(
        updateData
          ? "Berhasil memperbarui referal!"
          : "Berhasil menambahkan referal!",
        { id: loading },
      );
      return router.push("/admin/referal");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setLoading(false);
      return toast.error(
        updateData ? "Gagal memperbarui user!" : "Gagal menambahkan user!",
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
            <>Edit Referal {updateData.code}</>
          ) : (
            <>Buat Referal Baru</>
          )}
        </H2>
      </div>
      <form onSubmit={onSubmit} className="max-w-screen-lg space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Kode Referal</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan kode referal" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discount_in_percent"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Persentase Diskon (%)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Masukkan persentase diskon"
                  onChange={(e) => {
                    field.onChange(formatPrice(e.target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fee_in_percent"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Persentase Komisi (%)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Masukkan persentase diskon"
                  onChange={(e) => {
                    field.onChange(formatPrice(e.target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="user_id">Afiliator</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an affiliator" />
                  </SelectTrigger>
                  <SelectContent>
                    {affiliators.map((affiliator) => (
                      <SelectItem key={affiliator.id} value={affiliator.id}>
                        {affiliator.name} ({affiliator.email})
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
}
