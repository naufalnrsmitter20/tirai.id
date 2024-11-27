-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_email_verification_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_reset_password_user_id_fkey";

-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "email_verification_user_id" DROP NOT NULL,
ALTER COLUMN "reset_password_user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_email_verification_user_id_fkey" FOREIGN KEY ("email_verification_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_reset_password_user_id_fkey" FOREIGN KEY ("reset_password_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
