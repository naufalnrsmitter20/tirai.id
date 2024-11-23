"use server";
import { revalidatePath } from "next/cache";
import {
  createArticle,
  updateArticle,
  findArticle,
  hardDeleteArticle,
  findArticles,
} from "@/utils/database/article.query";
import { ArticlesWithUser } from "@/types/entityRelations";
import { uploadImageCloudinary, deleteImageCloudinary } from "./fileUploader";
import { ActionResponse, ActionResponses } from "@/lib/actions";
import { Prisma } from "@prisma/client";

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
        const articleData = await findArticle({ id });
        if (articleData?.cover_url) {
          await deleteImageCloudinary(articleData.cover_url);
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
        cover_url: uploadedImage!.data!.url,
        author: { connect: { id: author_id } },
      });
    } else {
      await updateArticle(
        { id },
        {
          ...articleInput,
          cover_url: uploadedImage?.data?.url,
        },
      );
    }
    revalidatePath("/");
    return (await ActionResponses()).success({ message: "Article upserted" });
  } catch (error) {
    console.log(error);
    return (await ActionResponses()).serverError("Failed to update article");
  }
};

export const updateArticleStatus = async (
  id: string,
  is_published: boolean,
): Promise<ActionResponse<{ id: string }>> => {
  try {
    await updateArticle({ id }, { is_published });
    return (await ActionResponses()).success({ id });
  } catch (error) {
    console.log(error);
    return (await ActionResponses()).serverError("Failed to update article");
  }
};

export const getArticleById = async (
  id: string,
): Promise<ActionResponse<ArticlesWithUser>> => {
  try {
    const articleData = await findArticle({ id });
    if (!articleData) {
      return (await ActionResponses()).notFound("Article not found");
    }
    await updateArticle({ id }, { views: articleData.views + 1 });

    return (await ActionResponses()).success(articleData);
  } catch (error) {
    console.log(error);
    return (await ActionResponses()).serverError("Failed to get article");
  }
};

export const deleteArticle = async (
  id: string,
): Promise<ActionResponse<{ id: string }>> => {
  try {
    await hardDeleteArticle({ id });
    return (await ActionResponses()).success({ id });
  } catch (error) {
    console.log(error);
    return (await ActionResponses()).serverError("Failed to delete article");
  }
};

export const getArticles = async ({
  tags,
  order,
  searchQuery,
}: {
  tags?: string[];
  order?: "latest" | "popular";
  searchQuery?: string;
}): Promise<ActionResponse<ArticlesWithUser[]>> => {
  try {
    const query: Prisma.ArticleWhereInput = {};
    if (tags && tags.length > 0) {
      query.tags = { hasSome: tags };
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

    const articles = await findArticles(query, order);
    return (await ActionResponses()).success(articles);
  } catch (error) {
    console.error(error);
    return (await ActionResponses()).serverError("Failed to get articles");
  }
};
