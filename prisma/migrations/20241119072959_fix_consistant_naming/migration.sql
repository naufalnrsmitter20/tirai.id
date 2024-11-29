/*
  Warnings:

  - You are about to drop the column `Material` on the `CustomRequest` table. All the data in the column will be lost.
  - You are about to drop the column `Model` on the `CustomRequest` table. All the data in the column will be lost.
  - You are about to drop the column `Price` on the `CustomRequest` table. All the data in the column will be lost.
  - You are about to drop the column `Description` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the `_MaterialToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ModelToProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `material` to the `CustomRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `CustomRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `CustomRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MaterialToProduct" DROP CONSTRAINT "_MaterialToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_MaterialToProduct" DROP CONSTRAINT "_MaterialToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "_ModelToProduct" DROP CONSTRAINT "_ModelToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_ModelToProduct" DROP CONSTRAINT "_ModelToProduct_B_fkey";

-- AlterTable
ALTER TABLE "CustomRequest" DROP COLUMN "Material",
DROP COLUMN "Model",
DROP COLUMN "Price",
ADD COLUMN     "material" TEXT NOT NULL,
ADD COLUMN     "model" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "Description",
ADD COLUMN     "description" TEXT NOT NULL;

-- DropTable
DROP TABLE "_MaterialToProduct";

-- DropTable
DROP TABLE "_ModelToProduct";
