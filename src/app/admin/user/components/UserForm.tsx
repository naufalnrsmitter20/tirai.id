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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { H2 } from "@/components/ui/text";
import { useZodForm } from "@/hooks/use-zod-form";
import { Role, User } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { nativeEnum, z } from "zod";

export default function UserForm({ updateData }: { updateData?: User }) {
  const router = useRouter();
  const upsertUserSchema = useMemo(
    () =>
      z.object({
        username: z.string().min(1, "Nama User wajib diisi."),
        email: z
          .string()
          .min(1, "Email wajib diisi.")
          .email("Email Tidak Valid."),
        password: updateData
          ? z.string().optional()
          : z.string().min(6, "Password minimal 6 karakter"),
        role: nativeEnum(Role),
      }),
    [updateData],
  );
  const [loading, setLoading] = useState(false);
  const form = useZodForm({
    defaultValues: {
      username: updateData?.name || "",
      email: updateData?.email || "",
      password: "",
      role: updateData?.role || "CUSTOMER",
    },
    schema: upsertUserSchema,
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
          role: values.role || "CUSTOMER",
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
          ? "Berhasil memperbarui user!"
          : "Berhasil menambahkan user!",
        { id: loading },
      );
      return router.push("/admin/user");
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
          {updateData ? <>Edit User {updateData.email}</> : <>Buat User Baru</>}
        </H2>
      </div>
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
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="role">Role User</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value)} 
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Role).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
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
