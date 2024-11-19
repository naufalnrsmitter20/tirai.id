/*
  Warnings:

  - You are about to drop the column `material` on the `CustomOption` table. All the data in the column will be lost.
  - You are about to drop the column `modelId` on the `CustomOption` table. All the data in the column will be lost.
  - You are about to drop the `Model` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CustomOptionToModel` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[product_id,color,size]` on the table `CustomOption` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_CustomOptionToModel" DROP CONSTRAINT "_CustomOptionToModel_A_fkey";

-- DropForeignKey
ALTER TABLE "_CustomOptionToModel" DROP CONSTRAINT "_CustomOptionToModel_B_fkey";

-- DropIndex
DROP INDEX "CustomOption_modelId_key";

-- DropIndex
DROP INDEX "CustomOption_product_id_color_size_material_key";

-- AlterTable
ALTER TABLE "CustomOption" DROP COLUMN "material",
DROP COLUMN "modelId";

-- DropTable
DROP TABLE "Model";

-- DropTable
DROP TABLE "_CustomOptionToModel";

-- CreateTable
CREATE TABLE "CustomRequest" (
    "id" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "width" TEXT NOT NULL,
    "Height" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "CustomRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomOption_product_id_color_size_key" ON "CustomOption"("product_id", "color", "size");

-- AddForeignKey
ALTER TABLE "CustomRequest" ADD CONSTRAINT "CustomRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
