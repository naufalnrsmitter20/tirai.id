"use client";

import { deleteUserAction } from "@/actions/users";
import { Body3, Body4, H3 } from "@/components/ui/text";
import { User } from "@prisma/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export const UserCard = ({ data }: { data: User }) => {
  const [loading, setLoading] = useState(false);
  return (
    <figure className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-black">
      <div>
        <H3 className="mb-2">{data.name}</H3>
        <Body3>{data.role}</Body3>
        <Body4>{data.email}</Body4>
      </div>
      <div className="mt-4 flex gap-3">
        <Button
          className="flex-grow"
          onClick={() => {
            redirect(`/admin/user/${data.id}`);
          }}
        >
          Edit
        </Button>
        <Button
          className="flex-grow"
          variant={"destructive"}
          onClick={async () => {
            setLoading(true);
            const toastId = toast.loading("Menghapus User...");
            const delUserRes = await deleteUserAction({
              data: {
                id: data.id,
              },
            });
            if (delUserRes.success) {
              setLoading(false);
              return toast.success("Berhasil menghapus user!");
            }
            setLoading(false);
            return toast.error("Gagal menghapus user!");
          }}
        >
          Delete
        </Button>
      </div>
    </figure>
  );
};
