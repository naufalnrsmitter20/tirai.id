"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import { getServerSession } from "@/lib/next-auth";
import { PaginatedResult } from "@/lib/paginator";
import { ArticleWithUser } from "@/types/entityRelations";
import {
  createArticle,
  findArticle,
  findArticles,
  hardDeleteArticle,
  updateArticle,
} from "@/utils/database/article.query";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { deleteImageCloudinary, uploadImageCloudinary } from "./fileUploader";

const parseFormData = (data: FormData) => {
  const title = data.get("title") as string;
  const slug = data.get("slug") as string;
  const description = data.get("description") as string;
  const content = data.get("content") as string;
  const rawTags = data.get("tags") as string | null;
  const tags = rawTags
    ? rawTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];
  const image = data.get("image") as File | null;
  const isPublished = data.get("is_published") === "true";
  const publishedAt = data.get("published_at") as string | null;

  return {
    title,
    slug,
    description,
    content,
    tags,
    image,
    isPublished,
    publishedAt,
  };
};

const handleImageUpload = async (image: File | null, articleId?: string) => {
  if (!image) return null;

  if (articleId) {
    const existingArticle = await findArticle({ id: articleId });
    if (existingArticle?.cover_url) {
      await deleteImageCloudinary(existingArticle.cover_url);
    }
  }

  const imageBuffer = await image.arrayBuffer();
  const uploadedImage = await uploadImageCloudinary(Buffer.from(imageBuffer));
  return uploadedImage?.data?.url || null;
};

const buildArticleInput = ({
  title,
  slug,
  description,
  content,
  tags,
  isPublished,
  publishedAt,
  coverUrl,
}: {
  title: string;
  slug: string;
  description: string;
  content: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  coverUrl: string | null;
}) => ({
  title,
  slug,
  description,
  content,
  tags,
  is_published: isPublished,
  published_at: publishedAt
    ? new Date(publishedAt)
    : isPublished
      ? new Date()
      : null,
  cover_url: coverUrl,
});

export const upsertArticle = async ({
  data,
  id,
}: {
  data: FormData;
  id?: string;
}): Promise<ActionResponse<{ message: string }>> => {
  try {
    const session = await getServerSession();

    const {
      title,
      slug,
      description,
      tags,
      content,
      image,
      isPublished,
      publishedAt,
    } = parseFormData(data);

    // Check if slug is already in use by another article
    const existingArticle = await findArticle({ slug });
    if (existingArticle && existingArticle.id !== id) {
      return ActionResponses.badRequest("Slug is already in use.");
    }

    // Ensure a cover image is provided for new articles
    if (!image && !id) {
      return ActionResponses.badRequest("Cover image is required!");
    }

    // Handle image upload and deletion if necessary
    const coverUrl = await handleImageUpload(image, id);

    // Build the input data for the article
    const articleInput = buildArticleInput({
      title,
      slug,
      description,
      content,
      tags,
      isPublished,
      publishedAt,
      coverUrl,
    });

    // Create or update the article
    if (id) {
      await updateArticle(
        { id },
        { ...articleInput, cover_url: articleInput.cover_url || undefined },
      );

      revalidatePath("/", "layout");
      return ActionResponses.success({
        message: "Article updated successfully!",
      });
    }

    await createArticle({
      ...articleInput,
      cover_url: articleInput.cover_url!,
      author: { connect: { id: session?.user?.id } },
    });

    revalidatePath("/", "layout");
    return ActionResponses.success({
      message: "Article created successfully!",
    });
  } catch (error) {
    console.error("Error upserting article:", error);
    return ActionResponses.serverError("Failed to upsert article");
  }
};

export const updateArticleStatus = async (
  id: string,
  is_published: boolean,
): Promise<ActionResponse<{ id: string }>> => {
  try {
    await updateArticle({ id }, { is_published, published_at: new Date() });

    revalidatePath("/", "layout");
    return ActionResponses.success({ id });
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Failed to update article");
  }
};

export const getArticleById = async (
  id: string,
): Promise<ActionResponse<ArticleWithUser>> => {
  try {
    const articleData = await findArticle({ id });
    if (!articleData) {
      return ActionResponses.notFound("Article not found");
    }

    return ActionResponses.success(articleData as ArticleWithUser);
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Failed to get article");
  }
};

export const deleteArticle = async (
  id: string,
): Promise<ActionResponse<{ id: string }>> => {
  try {
    const article = await findArticle({ id });
    if (article) {
      const deleteResult = await deleteImageCloudinary(article.cover_url);
      if (!deleteResult.success) {
        return ActionResponses.serverError("Failed to delete article");
      }
    }

    await hardDeleteArticle({ id });

    revalidatePath("/", "layout");
    return ActionResponses.success({ id });
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Failed to delete article");
  }
};

export const getArticles = async ({
  tags,
  order,
  searchQuery,
  status,
  startDate,
  endDate,
  page = 1,
  perPage = 6,
}: {
  tags?: string;
  order?: "latest" | "popular";
  searchQuery?: string;
  status?: boolean;
  startDate?: Date;
  endDate?: Date;
  perPage?: number;
  page?: number;
}): Promise<ActionResponse<PaginatedResult<ArticleWithUser>>> => {
  try {
    const query: Prisma.ArticleWhereInput = {};

    if (tags) {
      const tagsArray = tags.split(", ").filter((tag) => tag.trim() !== "");
      if (tagsArray.length > 0) {
        query.tags = { hasSome: tagsArray };
      }
    }

    if (searchQuery && searchQuery.trim() !== "") {
      query.OR = [
        {
          title: { contains: searchQuery, mode: Prisma.QueryMode.insensitive },
        },
        ...searchQuery.split(" ").map((term) => ({
          title: { contains: term, mode: Prisma.QueryMode.insensitive },
        })),
      ];
    }

    const articles = await findArticles(
      query,
      order,
      status,
      startDate,
      endDate,
      perPage,
      page,
    );

    return ActionResponses.success(articles);
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to get articles");
  }
};
