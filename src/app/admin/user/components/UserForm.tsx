"use client";

import { upsertUser } from "@/actions/users";
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
import { User } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function UserForm({ updateData }: { updateData?: User }) {
  const router = useRouter();
  const createArticleSchema = useMemo(
    () =>
      z.object({
        username: z.string().min(1, "Nama User wajib diisi."),
        email: z
          .string()
          .min(1, "Email wajib diisi.")
          .email("Email Tidak Valid."),
        phonenumber: z.string().optional(),
        password: updateData
          ? z.string().optional()
          : z.string().min(6, "Password minimal 6 karakter"),
      }),
    [updateData],
  );
  const [loading, setLoading] = useState(false);
  const form = useZodForm({
    defaultValues: {
      username: updateData?.name || "",
      email: updateData?.email || "",
      phonenumber: updateData?.phone_number || "",
      password: "",
    },
    schema: createArticleSchema,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);

    const loading = toast.loading(
      updateData ? "Memperbarui user..." : "Menambahkan user...",
    );

    try {
      const upsertUserResult = await upsertUser({
        data: {
          id: updateData?.id,
          email: values.email,
          name: values.username,
          password: values.password,
          phone_number: values.phonenumber,
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
      return toast.success(
        updateData
          ? "Berhasil memperbarui user!"
          : "Berhasil menambahkan user!",
        { id: loading },
      );
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
      {updateData && (
        <div className="mb-5 flex items-center gap-4">
          <Button
            variant={"link"}
            size={"link"}
            onClick={() => router.back()}
            type="button"
          >
            <ArrowLeft /> Kembali
          </Button>
          <H2 className="text-black">Edit User {updateData.email}</H2>
        </div>
      )}
      <form onSubmit={onSubmit} className="max-w-screen-lg space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Nama User</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan nama user" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Email User</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan email user" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phonenumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">No. Telp User</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan No. Telp user" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Password User</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Masukkan password user"
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
