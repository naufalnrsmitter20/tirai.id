import {
  updateSeoPage,
  createSeoPage,
  getSeoPageById,
  getSeo,
  deleteSeoPage,
} from "@/utils/database/seo.query";
import { uploadImageCloudinary } from "./fileUploader";
export async function updateSeoById(
  id: number | null,
  data: FormData,
  keywordsData: string[],
) {
  try {
    const page = data.get("page") as string;
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const keywords = keywordsData;
    const canonicalURL = data.get("canonicalURL") as string;
    const ogTitle = data.get("ogTitle") as string;
    const ogDescription = data.get("ogDescription") as string;
    const ogImageRaw = data.get("ogImage") as File;
    const ogImageBuffer = await ogImageRaw.arrayBuffer();
    const ogImage = await uploadImageCloudinary(Buffer.from(ogImageBuffer));
    const twitterCard = data.get("twitterCard") as string;
    const twitterTitle = data.get("twitterTitle") as string;
    const twitterDescription = data.get("twitterDescription") as string;
    const twitterImgRaw = data.get("twitterImg") as File;
    const twitterImgBuffer = await twitterImgRaw.arrayBuffer();
    const twitterImg = await uploadImageCloudinary(
      Buffer.from(twitterImgBuffer),
    );

    if (id) {
      const seoCurrentData = await getSeoPageById(id);
      const updateSeo = updateSeoPage(id, {
        page: page ?? seoCurrentData.page,
        title: title ?? seoCurrentData.title,
        description: description ?? seoCurrentData.description,
        keywords: keywords ?? seoCurrentData.keywords,
        canonicalURL: canonicalURL ?? seoCurrentData.canonicalURL,
        ogTitle: ogTitle ?? seoCurrentData.ogTitle,
        ogDescription: ogDescription ?? seoCurrentData.ogDescription,
        ogImage: ogImage.data?.url ?? seoCurrentData.ogImage,
        twitterCard: twitterCard ?? seoCurrentData.twitterCard,
        twitterTitle: twitterTitle ?? seoCurrentData.twitterTitle,
        twitterDescription: twitterDescription ?? seoCurrentData.description,
        twitterImage: twitterImg.data?.url ?? seoCurrentData.twitterImage,
      });
      if (!updateSeo) {
        throw new Error("invalid to update data");
      }
      return updateSeo;
    } else {
      const createSeo = createSeoPage({
        page,
        description,
        title,
        canonicalURL,
        keywords,
        ogDescription,
        ogImage: ogImage.data?.url,
        ogTitle,
        twitterCard,
        twitterDescription,
        twitterImage: twitterImg.data?.url,
        twitterTitle,
      });
      if (!createSeo) {
        throw new Error("invalid to create data");
      }
      return createSeo;
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getData(id: number | null) {
  try {
    if (id) {
      const getDataById = await getSeoPageById(id);
      if (!getDataById) {
        throw new Error("invalid to get data");
      }
      return getDataById;
    } else {
      const getAllData = await getSeo();
      const getDataSeo = getAllData.map((data) => {
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          page: data.page,
        };
      });
      if (!getDataSeo) {
        throw new Error("invalid get all data");
      }
      return getDataSeo;
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function deleteDataSeoById(id:number){
    try{
        if(!id) throw new Error('please input the id');
        const deleteSeoData=await deleteSeoPage(id);
        if(!deleteSeoData){
            throw new Error('invalid to delete this data');
        }
        return deleteSeoData;
    }catch(error){
        throw new Error((error as Error).message)
    }
}
