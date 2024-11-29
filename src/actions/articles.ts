"use server";
import { ActionResponse, ActionResponses } from "@/lib/actions";
import {
  createArticle,
  findArticle,
  findArticles,
  hardDeleteArticle,
  updateArticle,
} from "@/utils/database/article.query";
import { ArticleWithUser } from "@/types/entityRelations";
import { uploadImageCloudinary, deleteImageCloudinary } from "./fileUploader";
import { Article, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { PaginatedResult } from "@/lib/paginator";

export const upsertArticle = async ({
  data,
  id,
}: {
  data: FormData;
  id?: string;
}): Promise<ActionResponse<{ message: string }>> => {
  try {
    const title = data.get("title") as string;
    const slug = data.get("slug") as string;
    const rawTags = data.get("tags") as string | null;
    const tags = rawTags
      ? rawTags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
      : [];
    const content = data.get("content") as string;
    const author_id = data.get("author_id") as string;
    const image = data.get("image") as File;
    const is_published = data.get("is_published") === "true";

    let uploadedImage;
    if (image) {
      if (id) {
        const article = await findArticle({ id });
        if (article?.cover_url) {
          await deleteImageCloudinary(article.cover_url);
        }
      }
      const imageBuffer = await image.arrayBuffer();
      uploadedImage = await uploadImageCloudinary(Buffer.from(imageBuffer));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const articleInput: any = {
      title,
      slug,
      content,
      is_published,
    };

    if (tags.length > 0) {
      articleInput.tags = tags;
    }

    if (!id) {
      await createArticle({
        ...articleInput,
        cover_url: uploadedImage?.data?.url || null,
        author: { connect: { id: author_id } },
      });

      revalidatePath("/");
      return ActionResponses.success({ message: "Article updated" });
    }

    await updateArticle(
      { id },
      {
        ...articleInput,
        cover_url: uploadedImage?.data?.url,
      },
    );

    revalidatePath("/");
    return ActionResponses.success({ message: "Article upserted" });
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Failed to update article");
  }
};

export const updateArticleStatus = async (
  id: string,
  is_published: boolean,
): Promise<ActionResponse<{ id: string }>> => {
  try {
    await updateArticle({ id }, { is_published });
    return ActionResponses.success({ id });
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Failed to update article");
  }
};

export const getArticleById = async (
  id: string,
  action: "view" | "edit",
): Promise<ActionResponse<ArticleWithUser>> => {
  try {
    const articleData = await findArticle({ id });
    if (!articleData) {
      return ActionResponses.notFound("Article not found");
    }
    if (action === "view") {
      await updateArticle({ id }, { views: articleData.views + 1 });
    }

    return ActionResponses.success(articleData as ArticleWithUser);
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Failed to get article");
  }
};

export const getArticleBySlug = async (
  slug: string,
  action: "view" | "edit",
) => {
  try {
    const article = await findArticle({ slug });
    if (!article) {
      return ActionResponses.notFound(`Article ${slug} is not found`);
    }

    if (action === "view") {
      await updateArticle({ slug }, { views: article.views + 1 });
    }

    return ActionResponses.success(article);
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
      if (deleteResult.error) {
        return ActionResponses.serverError("Failed to delete article");
      }
    }

    await hardDeleteArticle({ id });
    revalidatePath("/admin/articles");
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
      const tagsArray = tags.split(" ").filter((tag) => tag.trim() !== "");
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
