-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_referal_id_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "referal_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_referal_id_fkey" FOREIGN KEY ("referal_id") REFERENCES "Referal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
