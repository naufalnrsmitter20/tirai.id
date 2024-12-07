/*
  Warnings:

  - You are about to drop the column `item_id` on the `CustomRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[custom_request_id]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CustomRequest" DROP CONSTRAINT "CustomRequest_item_id_fkey";

-- DropIndex
DROP INDEX "CustomRequest_item_id_key";

-- AlterTable
ALTER TABLE "CustomRequest" DROP COLUMN "item_id";

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "custom_request_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_custom_request_id_key" ON "OrderItem"("custom_request_id");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_custom_request_id_fkey" FOREIGN KEY ("custom_request_id") REFERENCES "CustomRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
