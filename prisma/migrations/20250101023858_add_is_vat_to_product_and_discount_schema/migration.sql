-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'AFFILIATE';
ALTER TYPE "Role" ADD VALUE 'AGENT';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "is_vat" BOOLEAN;

-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL,
    "discount_in_percent" DOUBLE PRECISION NOT NULL,
    "target_role" "Role" NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Discount_target_role_key" ON "Discount"("target_role");
