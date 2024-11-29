/*
  Warnings:

  - You are about to drop the column `Description` on the `CustomRequest` table. All the data in the column will be lost.
  - You are about to drop the column `Height` on the `CustomRequest` table. All the data in the column will be lost.
  - Added the required column `height` to the `CustomRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CustomRequest" DROP CONSTRAINT "CustomRequest_productId_fkey";

-- AlterTable
ALTER TABLE "CustomRequest" DROP COLUMN "Description",
DROP COLUMN "Height",
ADD COLUMN     "height" TEXT NOT NULL;
