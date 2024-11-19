/*
  Warnings:

  - You are about to drop the `_CustomRequestToMaterial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CustomRequestToModel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Material` to the `CustomRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Model` to the `CustomRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CustomRequestToMaterial" DROP CONSTRAINT "_CustomRequestToMaterial_A_fkey";

-- DropForeignKey
ALTER TABLE "_CustomRequestToMaterial" DROP CONSTRAINT "_CustomRequestToMaterial_B_fkey";

-- DropForeignKey
ALTER TABLE "_CustomRequestToModel" DROP CONSTRAINT "_CustomRequestToModel_A_fkey";

-- DropForeignKey
ALTER TABLE "_CustomRequestToModel" DROP CONSTRAINT "_CustomRequestToModel_B_fkey";

-- AlterTable
ALTER TABLE "CustomRequest" ADD COLUMN     "Material" TEXT NOT NULL,
ADD COLUMN     "Model" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CustomRequestToMaterial";

-- DropTable
DROP TABLE "_CustomRequestToModel";
