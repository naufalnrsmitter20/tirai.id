/*
  Warnings:

  - You are about to drop the column `forgot_password_otp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verification_token` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TokenPurpose" AS ENUM ('RESET_PASSWORD', 'EMAIL_VERIFICATION');

-- DropIndex
DROP INDEX "User_verification_token_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "forgot_password_otp",
DROP COLUMN "verification_token",
ADD COLUMN     "reset_password_token_id" TEXT,
ADD COLUMN     "verification_token_id" TEXT;

-- CreateTable
CREATE TABLE "Token" (
    "token" TEXT NOT NULL,
    "last_sent" TIMESTAMP(3),
    "sent_count" INTEGER NOT NULL DEFAULT 0,
    "purpose" "TokenPurpose" NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_verification_token_id_fkey" FOREIGN KEY ("verification_token_id") REFERENCES "Token"("token") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_reset_password_token_id_fkey" FOREIGN KEY ("reset_password_token_id") REFERENCES "Token"("token") ON DELETE SET NULL ON UPDATE CASCADE;
