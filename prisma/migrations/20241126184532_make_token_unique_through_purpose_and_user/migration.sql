/*
  Warnings:

  - You are about to drop the column `reset_password_token_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verification_token_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email_verification_user_id]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reset_password_user_id]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email_verification_user_id` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reset_password_user_id` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_reset_password_token_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_verification_token_id_fkey";

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "email_verification_user_id" TEXT NOT NULL,
ADD COLUMN     "reset_password_user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "reset_password_token_id",
DROP COLUMN "verification_token_id";

-- CreateIndex
CREATE UNIQUE INDEX "Token_email_verification_user_id_key" ON "Token"("email_verification_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Token_reset_password_user_id_key" ON "Token"("reset_password_user_id");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_email_verification_user_id_fkey" FOREIGN KEY ("email_verification_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_reset_password_user_id_fkey" FOREIGN KEY ("reset_password_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
