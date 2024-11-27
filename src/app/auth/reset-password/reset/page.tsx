"use client";

import { resetPassword } from "@/actions/auth/resetPassword";
import { requestResetPasswordMail } from "@/actions/mail";
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
import { Body3, H2 } from "@/components/ui/text";
import { COLORS } from "@/constants/color";
import { useZodForm } from "@/hooks/use-zod-form";
import { Lock } from "lucide-react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const resetPasswordSchema = z.object({
  new_password: z.string().min(8, "Kata sandi minimal 8 karakter"),
  confirm_new_password: z.string().min(8, "Kata sandi minimal 8 karakter"),
});

export default function ResetPasswordVerification() {
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const form = useZodForm({ schema: resetPasswordSchema });
  const router = useRouter();

  if (!resetToken) return notFound();

  const { handleSubmit } = form;

  const onSubmit = handleSubmit(async (fields) => {
    setLoading(true);

    const loadingToast = toast.loading("Loading...");

    if (fields.confirm_new_password !== fields.new_password) {
      setLoading(false);
      toast.error("Konfirmasi kata sandi dan kata sandi harus sama", {
        id: loadingToast,
      });
      return form.setError("confirm_new_password", {
        message: "Kata sandi tidak sama",
      });
    }

    const resetPasswordResult = await resetPassword(
      resetToken,
      fields.new_password,
    );

    if (resetPasswordResult.error) {
      if (resetPasswordResult.error.field === "expiry_date") {
        setLoading(false);
        return toast("Token Kadaluarsa", {
          description: "Token yang anda gunakan telah kadaluarsa",
          action: {
            label: "Kirim ulang",
            onClick: async () => {
              setLoading(true);

              const loadingToast = toast.loading("Loading...");
              const userEmail = resetPasswordResult.error!.message;

              const { error } = await requestResetPasswordMail(userEmail);

              if (error) {
                setLoading(false);
                return toast.error(error.message, { id: loadingToast });
              }

              setLoading(false);
              return toast.success(
                "Berhasil mengirim ulang email verifikasi!",
                {
                  id: loadingToast,
                },
              );
            },
          },
        });
      }

      setLoading(false);
      return toast.error(resetPasswordResult.error.message, {
        id: loadingToast,
      });
    }

    toast.success("Berhasil me-reset kata sandi!", { id: loadingToast });
    setLoading(false);
    return router.push(`/auth/login`);
  });

  return (
    <section className="flex w-full max-w-full flex-col items-center">
      <div className="justify center mb-8 flex max-w-[68px] items-center rounded-full bg-primary-50 p-[1.125rem]">
        <Lock color={COLORS.primary[900]} />
      </div>
      <div className="flex flex-col text-black">
        <H2 className="mb-3 w-full text-center">Atur Ulang Kata Sandi</H2>
        <Body3 className="mb-[3.375rem] text-center text-neutral-500">
          Kata sandi baru Anda harus berbeda dari kata sandi sebelumnya.
        </Body3>
        <Form {...form}>
          <form onSubmit={onSubmit} className="mb-8">
            <div className="mb-[3.375rem] flex w-full flex-col gap-y-[1.375rem]">
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel htmlFor="new_password">
                      Kata Sandi Baru
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukkan kata sandi baru"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_new_password"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel htmlFor="new_password">
                      Konfirmasi Kata Sandi Baru
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukkan konfirmasi kata sandi baru"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={loading} type="submit" className="w-full">
              Reset password
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
