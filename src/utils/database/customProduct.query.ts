import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// CRUD Product Custom
export const createProductCustom = async (data: Prisma.CustomRequestCreateInput) => {
    return await prisma.customRequest.create({ data });
}
export const updateProductCustom = async (where:Prisma.CustomRequestWhereUniqueInput ,data: Prisma.CustomRequestUpdateInput) => {
    return await prisma.customRequest.update({ where , data });
}
export const deleteProductCustom = async (where:Prisma.CustomRequestWhereUniqueInput) => {
    return await prisma.customRequest.delete({ where  });
}
export const findProductCustom = async (where:Prisma.CustomRequestWhereUniqueInput) => {
    return await prisma.customRequest.findUnique({ where  });
}

// model
export const createModel = async (data: Prisma.ModelCreateInput) => {
    return await prisma.model.create({ data });
}
export const updateModel = async (where:Prisma.ModelWhereUniqueInput ,data: Prisma.ModelUpdateInput) => {
    return await prisma.model.update({ where , data });
}
export const deleteModel = async (where:Prisma.ModelWhereUniqueInput) => {
    return await prisma.model.delete({ where  });
}
export const findModel = async (where:Prisma.ModelWhereUniqueInput) => {
    return await prisma.model.findUnique({ where  });
}

// material
export const createMaterial = async (data: Prisma.MaterialCreateInput) => {
    return await prisma.material.create({ data });
}
export const updateMaterial = async (where:Prisma.MaterialWhereUniqueInput ,data: Prisma.MaterialUpdateInput) => {
    return await prisma.material.update({ where , data });
}
export const deleteMaterial = async (where:Prisma.MaterialWhereUniqueInput) => {
    return await prisma.material.delete({ where  });
}
export const findMaterial = async (where:Prisma.MaterialWhereUniqueInput) => {
    return await prisma.material.findUnique({ where  });
}

