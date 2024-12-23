/*
  Warnings:

  - Made the column `shipping_price` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "shipping_price" SET NOT NULL;
