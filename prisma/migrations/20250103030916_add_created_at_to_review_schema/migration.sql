-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "CustomColor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "colorCode" TEXT NOT NULL,

    CONSTRAINT "CustomColor_pkey" PRIMARY KEY ("id")
);
