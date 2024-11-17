"use server";
import { ActionResponse, ActionResponses } from "@/lib/actions";
import {
  createArticle,
  findArticle,
  findArticles,
  hardDeleteArticle,
  updateArticle,
} from "@/utils/database/article.query";
<<<<<<< Updated upstream
import { Article } from "@prisma/client";
import { uploadImageCloudinary, deleteImageCloudinary } from "./fileUploader";
import { ActionResponse, ActionResponses } from "@/lib/actions";
import { Prisma } from "@prisma/client";
=======
import { Article, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { deleteImageCloudinary, uploadImageCloudinary } from "./fileUploader";
>>>>>>> Stashed changes

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
    return ActionResponses.success({ message: "Article created" });
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Failed to upsert article");
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
): Promise<ActionResponse<Article>> => {
  try {
    const article = await findArticle({ id });
    if (!article) {
      return ActionResponses.notFound("Article not found");
    }
    await updateArticle({ id }, { views: article.views + 1 });

    return ActionResponses.success(article);
  } catch (error) {
    console.log(error);
    return ActionResponses.serverError("Failed to get article");
  }
};

export const getArticleBySlug = async (slug: string) => {
  try {
    const article = await findArticle({ slug });
    if (!article) {
      return ActionResponses.notFound(`Article ${slug} is not found`);
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
    if (!article) {
      return ActionResponses.notFound(`Article with ${id} is not found`);
    }

    await hardDeleteArticle({ id });
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
}: {
  tags?: string[];
  order?: "latest" | "popular";
  searchQuery?: string;
}): Promise<ActionResponse<Article[]>> => {
  try {
    const query: Prisma.ArticleWhereInput = {};
    if (tags && tags.length > 0) {
      query.tags = { hasSome: tags };
    }

<<<<<<< Updated upstream
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

=======
>>>>>>> Stashed changes
    const articles = await findArticles(query, order);
    return ActionResponses.success(articles);
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to get articles");
  }
};
