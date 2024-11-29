/*
  Warnings:

  - You are about to drop the column `created_at` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `forgot_password_otp` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Token` table. All the data in the column will be lost.
  - Added the required column `published_at` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Token_email_key";

-- DropIndex
DROP INDEX "Token_phone_number_key";

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "published_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "created_at",
DROP COLUMN "email",
DROP COLUMN "forgot_password_otp",
DROP COLUMN "password",
DROP COLUMN "phone_number",
DROP COLUMN "role",
DROP COLUMN "updated_at";
