"use server";

import { revalidatePath } from "next/cache";
import {
  updateSeoPage,
  createSeoPage,
  getSeoPageById,
  getSeo,
  deleteSeoPage,
} from "@/utils/database/seo.query";
import { uploadImageCloudinary } from "./fileUploader";
import { ActionResponse, ActionResponses } from "@/lib/actions";
import { Prisma, SEO } from "@prisma/client";

async function uploadSeoImage(
  imageFile: FormDataEntryValue | null,
): Promise<string | null> {
  if (!imageFile || !(imageFile instanceof Blob)) {
    return null;
  }

  try {
    const imageBytes = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(imageBytes);
    const uploadResult = await uploadImageCloudinary(imageBuffer);
    return uploadResult.data?.url || null;
  } catch {
    return null;
  }
}

export async function updateSeoById(
  pageId: number | null,
  formData: FormData,
  seoKeywords: string[],
): Promise<ActionResponse<SEO>> {
  try {
    const imageUrl = await uploadSeoImage(formData.get("ogImage"));
    const page = formData.get("page") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const canonicalURL = formData.get("canonicalURL") as string | null;
    const twitterCard = formData.get("twitterCard") as string | null;

    const seoPageData: Prisma.SEOUncheckedCreateInput = {
      page,
      title,
      description,
      keywords: seoKeywords,
      canonicalURL,
      ogTitle: title,
      ogDescription: description,
      ogImage: imageUrl || undefined,
      twitterCard,
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: imageUrl || undefined,
    };

    if (pageId) {
      const existingSeoPage = await getSeoPageById(pageId);
      if (!existingSeoPage) {
        return ActionResponses.notFound(`SEO page with id ${pageId} not found`);
      }

      const updatedSeoPage = await updateSeoPage(pageId, {
        ...existingSeoPage,
        ...seoPageData,
        keywords: seoKeywords?.length
          ? seoPageData.keywords
          : existingSeoPage.keywords,
      });

      revalidatePath("/", "layout");
      return ActionResponses.success(updatedSeoPage);
    }

    const newSeoPage = await createSeoPage(seoPageData);
    revalidatePath("/", "layout");
    return ActionResponses.success(newSeoPage);
  } catch (error) {
    return ActionResponses.serverError((error as Error).message);
  }
}

export async function getSeoPages(
  pageId: number | null,
): Promise<ActionResponse> {
  try {
    if (pageId) {
      const seoPage = await getSeoPageById(pageId);
      if (!seoPage) {
        return ActionResponses.notFound(`SEO page with id ${pageId} not found`);
      }
      return ActionResponses.success(seoPage);
    }

    const allSeoPages = await getSeo();
    const seoPagesSummary = allSeoPages.map(
      ({ id, title, description, page }) => ({
        id,
        title,
        description,
        page,
      }),
    );
    return ActionResponses.success(seoPagesSummary);
  } catch (error) {
    return ActionResponses.serverError((error as Error).message);
  }
}

export async function deleteSeoPageById(
  pageId: number,
): Promise<ActionResponse> {
  try {
    if (!pageId) {
      return ActionResponses.badRequest("Page ID is required");
    }

    const deletedPage = await deleteSeoPage(pageId);
    if (!deletedPage) {
      return ActionResponses.notFound(`SEO page with id ${pageId} not found`);
    }

    revalidatePath("/", "layout");
    return ActionResponses.success(deletedPage);
  } catch (error) {
    return ActionResponses.serverError((error as Error).message);
  }
}
