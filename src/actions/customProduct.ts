import { ActionResponses } from "@/lib/actions";
import {
  createMaterial,
  createModel,
  createProductCustom,
  deleteMaterial,
  deleteModel,
  deleteProductCustom,
  updateMaterial,
  updateModel,
  updateProductCustom,
} from "@/utils/database/customProduct.query";
import { revalidatePath } from "next/cache";

// handling user request custom product
export const addCustomProductByUser = async (data: FormData) => {
  const width = data.get("width") as string;
  const height = data.get("height") as string;
  const material = data.get("Material") as string;
  const model = data.get("model") as string;
  const price = parseFloat(data.get("price") as string);
  const size = data.get("size") as string;
  const color = data.get("color") as string;
  try {
    const productCustom = await createProductCustom({
      width,
      height,
      size,
      color,
      price,
      material,
      model,
    });
    if (!productCustom) {
      return ActionResponses.serverError("Failed to get create Product Custom");
    }
    revalidatePath("/");
    ActionResponses.success("succes create Custom Product");
    return productCustom;
  } catch (error) {
    console.log((error as Error).message);
    return ActionResponses.serverError("Failed to create Product Custom");
  }
};

export const updateCustomProduct = async (id: string, data: FormData) => {
  const width = data.get("width") as string;
  const height = data.get("height") as string;
  const price = parseFloat(data.get("price") as string);
  const size = data.get("size") as string;
  const color = data.get("color") as string;
  try {
    const productCustom = await updateProductCustom(
      { id },
      {
        width,
        height,
        size,
        color,
        price,
      },
    );
    if (!productCustom) {
      return ActionResponses.serverError("Failed to get create Product Custom");
    }
    revalidatePath("/");
    ActionResponses.success("succes Update Custom Product");
    return productCustom;
  } catch (error) {
    console.log((error as Error).message);
    return ActionResponses.serverError("Failed to create Product Custom");
  }
};

export const deleteCustomProduct = async (id: string) => {
  try {
    const deleteCustomReq = await deleteProductCustom({ id });
    if (!deleteCustomReq) {
      return ActionResponses.serverError("Failed to delete Product Custom");
    }
    revalidatePath("/");
    ActionResponses.success("succes delete Custom Product");
    return deleteCustomReq;
  } catch (error) {
    console.log((error as Error).message);
    return ActionResponses.serverError("Failed to delete Product Custom");
  }
};

// model
export const addModel = async (
  id: string | null,
  data: FormData,
) => {
  const description = data.get("description") as string;
  const model = data.get("model") as string;
  try {
    if (!id) {
      const Model = await createModel({
        description,
        model,
      });
      if (!Model) {
        return ActionResponses.serverError(
          "Failed to get create Product Custom",
        );
      }
      revalidatePath("/");
      ActionResponses.success("succes create Model");
      return Model;
    } else {
      const Model = await updateModel(
        { id },
        {
          description,
          model,
        },
      );
      if (!Model) {
        return ActionResponses.serverError(
          "Failed to get create Product Custom",
        );
      }
      revalidatePath("/");
      ActionResponses.success("succes update Model");
      return Model;
    }
  } catch (error) {
    console.log((error as Error).message);
    return ActionResponses.serverError("Failed to create Product Custom");
  }
};

export const deleteModelbyUser = async (id: string) => {
  try {
    const deleteModels = await deleteModel({ id });
    if (!deleteModels) {
      return ActionResponses.serverError("Failed to delete Product Custom");
    }
    revalidatePath("/");
    ActionResponses.success("succes delete model");
    return deleteModels;
  } catch (error) {
    console.log((error as Error).message);
    return ActionResponses.serverError("Failed to delete Product Custom");
  }
};
// material
export const addMaterial = async (
  id: string | null,
  data: FormData,
) => {
  const name = data.get("name") as string;
  const price = parseFloat(data.get("price") as string);
  try {
    if (!id) {
      const Material = await createMaterial({
        name,
        price,
      });
      if (!Material) {
        return ActionResponses.serverError(
          "Failed to get create Product Custom",
        );
      }
      revalidatePath("/");
      ActionResponses.success("succes create Material");
      return Material;
    } else {
      const Material = await updateMaterial(
        { id },
        {
          name,
          price,
        },
      );
      if (!Material) {
        return ActionResponses.serverError(
          "Failed to get create Product Custom",
        );
      }
      revalidatePath("/");
      ActionResponses.success("succes upadate Material");
      return Material;
    }
  } catch (error) {
    console.log((error as Error).message);
    return ActionResponses.serverError("Failed to create Product Custom");
  }
};

export const deleteMaterialbyUser = async (id: string) => {
  try {
    const deleteMaterials = await deleteMaterial({ id });
    if (!deleteMaterials) {
      return ActionResponses.serverError("Failed to delete Product Custom");
    }

    revalidatePath("/");
    ActionResponses.success("succes delete Material");
    return deleteMaterials;
  } catch (error) {
    console.log((error as Error).message);
    return ActionResponses.serverError("Failed to delete Product Custom");
  }
};

export const GetMaterials = async () => {};
