/*
  Warnings:

  - You are about to drop the column `phone_number` on the `User` table. All the data in the column will be lost.
  - Added the required column `phone_number` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_phone_number_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "phone_number" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone_number";
