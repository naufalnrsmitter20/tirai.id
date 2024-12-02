"use client";

import { createImageUpload } from "novel/plugins";

const onUpload = (file: File) => {
  const promise = fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": file?.type || "application/octet-stream",
      "x-vercel-filename": file?.name || "image.png",
    },
    body: file,
  });

  return new Promise((resolve) => {
    promise.then(async (res) => {
      // Successfully uploaded image
      if (res.status === 200) {
        const { url } = (await res.json()) as { url: string };
        // preload the image
        const image = new Image();
        image.src = url;
        image.onload = () => {
          resolve(url);
        };
        // No blob store configured
      } else if (res.status === 401) {
        resolve(file);
        throw new Error(
          "`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.",
        );
        // Unknown error
      } else {
        const response = await res.json();
        throw new Error(`Error uploading image. Please try again.`, response);
      }
    });
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
