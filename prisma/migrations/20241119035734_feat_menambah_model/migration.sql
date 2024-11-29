/*
  Warnings:

  - You are about to drop the column `model` on the `CustomOption` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[modelId]` on the table `CustomOption` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_id,color,size,material]` on the table `CustomOption` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `modelId` to the `CustomOption` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CustomOption_product_id_color_size_key";

-- AlterTable
ALTER TABLE "CustomOption" DROP COLUMN "model",
ADD COLUMN     "modelId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "Deskription" TEXT NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CustomOptionToModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CustomOptionToModel_AB_unique" ON "_CustomOptionToModel"("A", "B");

-- CreateIndex
CREATE INDEX "_CustomOptionToModel_B_index" ON "_CustomOptionToModel"("B");

-- CreateIndex
CREATE UNIQUE INDEX "CustomOption_modelId_key" ON "CustomOption"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomOption_product_id_color_size_material_key" ON "CustomOption"("product_id", "color", "size", "material");

-- AddForeignKey
ALTER TABLE "_CustomOptionToModel" ADD CONSTRAINT "_CustomOptionToModel_A_fkey" FOREIGN KEY ("A") REFERENCES "CustomOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomOptionToModel" ADD CONSTRAINT "_CustomOptionToModel_B_fkey" FOREIGN KEY ("B") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
