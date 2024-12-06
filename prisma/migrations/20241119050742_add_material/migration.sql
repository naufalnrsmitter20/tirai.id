/*
  Warnings:

  - You are about to drop the column `material` on the `CustomRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CustomRequest" DROP COLUMN "material";

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MaterialToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CustomRequestToMaterial" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CustomRequestToModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MaterialToProduct_AB_unique" ON "_MaterialToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_MaterialToProduct_B_index" ON "_MaterialToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CustomRequestToMaterial_AB_unique" ON "_CustomRequestToMaterial"("A", "B");

-- CreateIndex
CREATE INDEX "_CustomRequestToMaterial_B_index" ON "_CustomRequestToMaterial"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CustomRequestToModel_AB_unique" ON "_CustomRequestToModel"("A", "B");

-- CreateIndex
CREATE INDEX "_CustomRequestToModel_B_index" ON "_CustomRequestToModel"("B");

-- AddForeignKey
ALTER TABLE "_MaterialToProduct" ADD CONSTRAINT "_MaterialToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToProduct" ADD CONSTRAINT "_MaterialToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomRequestToMaterial" ADD CONSTRAINT "_CustomRequestToMaterial_A_fkey" FOREIGN KEY ("A") REFERENCES "CustomRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomRequestToMaterial" ADD CONSTRAINT "_CustomRequestToMaterial_B_fkey" FOREIGN KEY ("B") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomRequestToModel" ADD CONSTRAINT "_CustomRequestToModel_A_fkey" FOREIGN KEY ("A") REFERENCES "CustomRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomRequestToModel" ADD CONSTRAINT "_CustomRequestToModel_B_fkey" FOREIGN KEY ("B") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
