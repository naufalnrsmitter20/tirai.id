/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Made the column `updated_at` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "forgot_password_otp" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updated_at" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Token_email_key" ON "Token"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Token_phone_number_key" ON "Token"("phone_number");
