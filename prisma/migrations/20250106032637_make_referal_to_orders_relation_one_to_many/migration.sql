/*
  Warnings:

  - You are about to drop the `_OrderToReferal` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `referal_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_OrderToReferal" DROP CONSTRAINT "_OrderToReferal_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToReferal" DROP CONSTRAINT "_OrderToReferal_B_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "referal_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_OrderToReferal";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_referal_id_fkey" FOREIGN KEY ("referal_id") REFERENCES "Referal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
