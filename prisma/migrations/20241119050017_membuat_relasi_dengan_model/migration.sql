-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "Description" TEXT NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ModelToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ModelToProduct_AB_unique" ON "_ModelToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_ModelToProduct_B_index" ON "_ModelToProduct"("B");

-- AddForeignKey
ALTER TABLE "_ModelToProduct" ADD CONSTRAINT "_ModelToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModelToProduct" ADD CONSTRAINT "_ModelToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
