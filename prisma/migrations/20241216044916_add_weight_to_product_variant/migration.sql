/*
  Warnings:

  - Added the required column `weight` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "weight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;
