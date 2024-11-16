"use server";
import { revalidatePath } from "next/cache";
import {
  createArticle,
  updateArticle,
  findArticle,
  hardDeleteArticle,
  findArticles,
} from "@/utils/database/article.query";
import { Article } from "@prisma/client";
import { uploadImageCloudinary, deleteImageCloudinary } from "./fileUploader";
import { ActionResponse, ActionResponses } from "@/lib/actions";

export async function upsertArticle({
  data,
  id,
}: {
  data: FormData;
  id?: string;
}): Promise<ActionResponse<{ message: string }>> {
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
    };

    if (tags.length > 0) {
      articleInput.tags = tags;
    }

    if (!id) {
      await createArticle({
        ...articleInput,
        cover_url: uploadedImage?.data?.url,
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
    return ActionResponses.success({ message: "Article upserted" });
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Failed to upsert article");
  }
}

export async function updateArticleStatus(
  id: string,
  is_published: boolean,
): Promise<ActionResponse<{ id: string }>> {
  try {
    await updateArticle({ id }, { is_published });
    return ActionResponses.success({ id });
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Failed to get article");
  }
}

export async function getArticleById(
  id: string,
): Promise<ActionResponse<Article>> {
  try {
    const articleData = await findArticle({ id });
    if (!articleData) {
      return ActionResponses.notFound("Article not found");
    }
    await updateArticle({ id }, { views: articleData.views + 1 });

    return ActionResponses.success(articleData);
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Failed to get article");
  }
}

export async function deleteArticle(
  id: string,
): Promise<ActionResponse<{ id: string }>> {
  try {
    await hardDeleteArticle({ id });
    return ActionResponses.success({ id });
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Failed to delete article");
  }
}

export async function getArticles({
  tags,
  order,
}: {
  tags?: string[];
  order?: "latest" | "popular";
}): Promise<ActionResponse<Article[]>> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (tags && tags.length > 0) {
      query.tags = { hasSome: tags };
    }
    const articles = await findArticles(query, order);
    return ActionResponses.success(articles);
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to get articles");
  }
}
