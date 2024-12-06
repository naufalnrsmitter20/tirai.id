"use client";

import { uploadImageCloudinary } from "@/actions/fileUploader";
import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";

const onUpload = async (file: File) => {
  const loadingToast = toast.loading("Mengupload gambar...");

  const cloudinaryResponse = await uploadImageCloudinary(
    await file.arrayBuffer(),
  );
  if (cloudinaryResponse.error) {
    toast.error("Gagal mengupload gambar", { id: loadingToast });
    throw new Error(cloudinaryResponse.error.message);
  }

  return new Promise((resolve) => {
    // preload the image
    const image = new Image();
    if (cloudinaryResponse.data?.url) {
      toast.success("Sukses mengupload gambar", { id: loadingToast });
      image.src = cloudinaryResponse.data.url;
    }
    image.onload = () => {
      resolve(cloudinaryResponse.data?.url);
    };
  });
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      return false;
    } else if (file.size / 1024 / 1024 > 10) {
      // Check if the file size is bigger than 10mb
      return false;
    }
    return true;
  },
});
