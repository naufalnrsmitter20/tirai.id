"use client";

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
import { Dispatch, FC, SetStateAction } from "react";
import { toast } from "sonner";
import { z } from "zod";

const resetPasswordConfirmationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email harus diisi!" })
    .email("Email tidak valid!"),
});

export const ResetPasswordEmailForm: FC<{
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setHasSent: Dispatch<SetStateAction<boolean>>;
  setHasSentEmail: Dispatch<SetStateAction<string | undefined>>;
}> = ({ loading, setLoading, setHasSent, setHasSentEmail }) => {
  const form = useZodForm({ schema: resetPasswordConfirmationSchema });

  const { handleSubmit } = form;

  const onSubmit = handleSubmit(async (fields) => {
    setLoading(true);

    const loadingToast = toast.loading("Loading...");

    const requestResetPasswordMailResult = await requestResetPasswordMail(
      fields.email,
    );

    if (requestResetPasswordMailResult.error) {
      setLoading(false);
      return toast.error(requestResetPasswordMailResult.error.message, {
        id: loadingToast,
      });
    }

    toast.success(
      "Email konfirmasi permintaan reset kata sandi telah dikirim",
      { id: loadingToast },
    );
    setLoading(false);
    setHasSentEmail(fields.email);
    return setHasSent(true);
  });

  return (
    <>
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
            <Button disabled={loading} type="submit" className="w-full">
              Konfirmasi
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
