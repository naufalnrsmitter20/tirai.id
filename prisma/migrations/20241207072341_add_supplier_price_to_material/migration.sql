/*
  Warnings:

  - Added the required column `supplier_price` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Material" ADD COLUMN "supplier_price" DOUBLE PRECISION NOT NULL;
