"use client";

import Image from "next/image";
import { FC, useMemo } from "react";

export const CoverPreview: FC<{
  image?: File | null;
  updateData?: { cover_url?: string };
}> = ({ image, updateData }) => {
  // Memoize the object URL to avoid re-creating it on each render
  const imageUrl = useMemo(() => {
    if (image) {
      return URL.createObjectURL(image);
    }
    return updateData?.cover_url || null;
  }, [image, updateData?.cover_url]);

  if (!imageUrl) return null;

  return (
    <div className="mt-4">
      <Image
        src={imageUrl}
        width={300}
        height={200}
        alt="Cover Preview"
        className="max-h-64"
        unoptimized
      />
    </div>
  );
};
