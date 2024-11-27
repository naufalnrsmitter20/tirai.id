/*
  Warnings:

  - Added the required column `expiry_date` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "expiry_date" TIMESTAMP(3) NOT NULL;
