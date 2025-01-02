"use client";

import { Separator } from "@/components/ui/separator";
import { Body3 } from "@/components/ui/text";
import { StarsSelector } from "./StarsSelector";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { Review } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const ReviewForm: FC<{ review: Review | null }> = ({ review }) => {
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    const loadingId = toast.loading("Mengirim ulasan...");

    // TODO: Submit review action

    setLoading(false);
    toast.success("Berhasil mengirim ulasan", {
      id: loadingId,
    });
    return router.refresh();
  };

  return (
    <>
      <Separator />
      <form onSubmit={handleSubmit}>
        <Body3 className="mb-5 font-medium text-black">Review</Body3>
        <StarsSelector value={review?.rating} />
        <Textarea
          className="mt-3"
          value={review?.content}
          placeholder="Tulis ulasan anda..."
          disabled={review !== null}
          required
        />
        {review === null && (
          <Button className="mt-3 w-full" type="submit">
            Kirim ulasan
          </Button>
        )}
      </form>
    </>
  );
};
