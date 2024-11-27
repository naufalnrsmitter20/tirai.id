/*
  Warnings:

  - Made the column `updated_at` on table `Article` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `photo` to the `CustomOption` table without a default value. This is not possible if the table is not empty.
  - Made the column `size` on table `CustomOption` required. This step will fail if there are existing NULL values in that column.
  - Made the column `color` on table `CustomOption` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "CustomOption" ADD COLUMN     "photo" TEXT NOT NULL,
ALTER COLUMN "size" SET NOT NULL,
ALTER COLUMN "color" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone_number" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
