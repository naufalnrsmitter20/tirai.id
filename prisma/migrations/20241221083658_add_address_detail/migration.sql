/*
  Warnings:

  - You are about to drop the column `region` on the `ShippingAddress` table. All the data in the column will be lost.
  - Added the required column `district` to the `ShippingAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `ShippingAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `village` to the `ShippingAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShippingAddress" DROP COLUMN "region",
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "village" TEXT NOT NULL;
