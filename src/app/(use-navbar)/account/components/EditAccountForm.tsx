"use client";

import { upsertUser } from "@/actions/users";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useZodForm } from "@/hooks/use-zod-form";
import { signOut } from "next-auth/react";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { FC, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const EditAccountForm: FC<{
  user: { id: string; name: string; email: string };
}> = ({ user }) => {
  const editAccountScheam = z.object({
    name: z.string().min(1, "Nama harus diisi!"),
    email: z.string().email("Email tidak valid!"),
  });

  const [loading, setLoading] = useState(false);

  const form = useZodForm({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    schema: editAccountScheam,
  });
  const router = useRouter();

  const onSubmit = form.handleSubmit(async (fields) => {
    setLoading(true);

    const loadingToast = toast.loading("Loading...");

    const upsertUserResult = await upsertUser({
      data: { id: user.id, ...fields },
    });

    if (upsertUserResult.error) {
      setLoading(false);
      return toast.error(upsertUserResult.error.message, {
        id: loadingToast,
      });
    }

    toast.success("Berhasil mengubah data akun!", { id: loadingToast });
    setLoading(false);
    return router.push("/account");
  });

  const [name, email] = form.watch(["name", "email"]);

  return (
    <Form {...form}>
      <form className="flex w-full flex-col" onSubmit={onSubmit}>
        <div className="mb-8 flex w-full flex-col gap-y-[1.375rem]">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <FormLabel htmlFor="email">Nama</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Masukkan nama anda" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Masukkan alamat email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          variant={"default"}
          className="mb-6"
          disabled={(user.name === name && user.email === email) || loading}
        >
          Simpan
        </Button>
        <div className="flex flex-col gap-y-2">
          <Link
            href={"/auth/reset-password"}
            className={buttonVariants({
              variant: "outline",
              className: loading ? "pointer-events-none" : "",
            })}
          >
            Ubah Password
          </Link>
          <Button
            variant={"destructive"}
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            disabled={loading}
          >
            Logout
          </Button>
        </div>
      </form>
    </Form>
  );
};
