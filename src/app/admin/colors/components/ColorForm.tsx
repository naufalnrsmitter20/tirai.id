"use client";

import { upsertColor } from "@/actions/customProduct/colors";
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
import { CustomColor } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

interface ColorFormProps {
  updateData?: CustomColor;
}

export default function ColorForm({ updateData }: ColorFormProps) {
  const router = useRouter();
  const colorFormSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, "Color name is required."),
        colorCode: z.string().min(1, "Color selection is required."),
      }),
    [],
  );

  const [loading, setLoading] = useState(false);

  const form = useZodForm({
    defaultValues: {
      name: updateData?.name || "",
      colorCode: updateData?.colorCode || "#000000",
    },
    schema: colorFormSchema,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    const loadingToast = toast.loading(
      updateData ? "Updating color..." : "Adding new color...",
    );

    try {
      console.log(values);
      const upsertResult = await upsertColor({
        id: updateData?.id?.toString(),
        ...values,
      });

      if (!upsertResult.success) {
        setLoading(false);
        return toast.error(
          updateData ? "Failed to update color!" : "Failed to add color!",
          { id: loadingToast },
        );
      }

      setLoading(false);
      toast.success(
        updateData
          ? "Color updated successfully!"
          : "Color added successfully!",
        { id: loadingToast },
      );
      return router.push("/admin/colors");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setLoading(false);
      return toast.error(
        updateData ? "Failed to update color!" : "Failed to add color!",
        { id: loadingToast },
      );
    }
  });

  const watchedColor = form.watch("colorCode");

  return (
    <Form {...form}>
      <div className="mb-12 flex flex-col items-start gap-4">
        <Button
          variant="link"
          size="link"
          onClick={() => router.back()}
          type="button"
        >
          <ArrowLeft className="mr-2" /> Back
        </Button>
        <H2 className="text-black">
          {updateData ? <>Edit Color: {updateData.name}</> : <>Add New Color</>}
        </H2>
      </div>

      <form onSubmit={onSubmit} className="max-w-screen-lg space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter color name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="colorCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Color</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="color"
                    {...field}
                    className="h-10 w-20 cursor-pointer p-1"
                  />
                  <Input
                    {...field}
                    placeholder="#000000"
                    className="font-mono uppercase"
                    maxLength={7}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Ensure the input starts with #
                      if (!value.startsWith("#")) {
                        field.onChange("#" + value);
                      } else {
                        field.onChange(value);
                      }
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-lg border p-4">
          <div className="mb-2 text-sm font-medium">Color Preview</div>
          <div
            className="h-32 w-full rounded-md transition-colors duration-200"
            style={{ backgroundColor: watchedColor }}
          />
        </div>

        <Button disabled={loading} type="submit" className="w-full">
          Save
        </Button>
      </form>
    </Form>
  );
}
