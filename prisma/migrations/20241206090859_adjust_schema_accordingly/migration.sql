/*
  Warnings:

  - You are about to drop the column `custom_option_id` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `CustomOption` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[item_id]` on the table `CustomRequest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Material` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[model]` on the table `Model` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `item_id` to the `CustomRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplier_price` to the `CustomRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimated_finish_time` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SUPPLIER';

-- DropForeignKey
ALTER TABLE "CustomOption" DROP CONSTRAINT "CustomOption_product_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_custom_option_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_product_id_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_user_id_fkey";

-- AlterTable
ALTER TABLE "CustomRequest" ADD COLUMN     "item_id" TEXT NOT NULL,
ADD COLUMN     "supplier_price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shipping_address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "custom_option_id",
DROP COLUMN "product_id",
ADD COLUMN     "variant_id" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
DROP COLUMN "is_public",
DROP COLUMN "price",
DROP COLUMN "stock",
ADD COLUMN     "category_id" TEXT NOT NULL,
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "estimated_finish_time" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "CustomOption";

-- DropEnum
DROP TYPE "ProductCategory";

-- CreateTable
CREATE TABLE "ShippingAddress" (
    "id" TEXT NOT NULL,
    "recipient_name" TEXT NOT NULL,
    "recipient_phone_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "additional_info" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "ShippingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "content" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "order_item_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_slug_key" ON "ProductCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Review_order_item_id_key" ON "Review"("order_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "Review_order_item_id_order_id_key" ON "Review"("order_item_id", "order_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_product_id_color_size_key" ON "ProductVariant"("product_id", "color", "size");

-- CreateIndex
CREATE UNIQUE INDEX "CustomRequest_item_id_key" ON "CustomRequest"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "Material_name_key" ON "Material"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Model_model_key" ON "Model"("model");

-- AddForeignKey
ALTER TABLE "ShippingAddress" ADD CONSTRAINT "ShippingAddress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomRequest" ADD CONSTRAINT "CustomRequest_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
