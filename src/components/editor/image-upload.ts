"use client";

import { createImageUpload } from "novel/plugins";
import { uploadImageCloudinary } from "@/actions/fileUploader";

const onUpload = async (file: File) => {
  const cloudinaryResponse = await uploadImageCloudinary(
    await file.arrayBuffer(),
  );
  if (cloudinaryResponse.error) {
    throw new Error(cloudinaryResponse.error.message);
  }

  return new Promise((resolve) => {
    // preload the image
    const image = new Image();
    if (cloudinaryResponse.data?.url) {
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
    } else if (file.size / 1024 / 1024 > 20) {
      return false;
    }
    return true;
  },
});
