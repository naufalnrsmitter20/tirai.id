"use server";

import { UploadApiResponse } from "cloudinary";

import cloudinary from "@/lib/cloudinary";
import { ActionResponse, ActionResponses } from "@/lib/actions";

export async function uploadImageCloudinary(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: Buffer | any,
): Promise<ActionResponse<{ format: string; url: string }>> {
  try {
    const upload: UploadApiResponse | undefined = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream((error, uploadResult) => {
            if (error) reject(error);
            return resolve(uploadResult);
          })
          .end(Buffer.isBuffer(file) ? file : Buffer.from(file));
      },
    );

    if (!upload) return ActionResponses.serverError("Gagal mengupload!");

    const data = {
      format: upload.format,
      url: upload.secure_url,
    };

    return ActionResponses.success(data);
  } catch (e) {
    console.error(e);
    const error = e as Error;
    return ActionResponses.serverError(
      error.message.includes("not allowed")
        ? error.message
        : "Terjadi kesalahan",
    );
  }
}

export async function deleteImageCloudinary(filename: string) {
  try {
    const publicId = filename.split("/").pop()?.split(".")[0] || "";
    const deleteResult = await cloudinary.uploader.destroy(publicId);

    if (deleteResult.result === "ok") {
      return { error: false, message: "Image deleted successfully" };
    } else {
      return { error: true, message: "terjadi kesalahan" };
    }
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Terjadi kesalahan saat menghapus gambar",
    };
  }
}
