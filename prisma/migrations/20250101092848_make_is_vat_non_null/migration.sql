/*
  Warnings:

  - Made the column `is_vat` on table `CustomRequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_vat` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CustomRequest" ALTER COLUMN "is_vat" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "is_vat" SET NOT NULL;
