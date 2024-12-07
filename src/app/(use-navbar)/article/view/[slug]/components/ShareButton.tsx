"use client";

import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { FC } from "react";

export const ShareButton: FC<{ shareData: ShareData }> = ({ shareData }) => {
  return (
    <Button
      variant={"link"}
      size={"link"}
      onClick={async () => {
        await navigator.share(shareData);
      }}
    >
      <Share />
    </Button>
  );
};
