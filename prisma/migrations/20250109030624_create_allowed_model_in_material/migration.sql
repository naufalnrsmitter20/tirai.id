-- CreateTable
CREATE TABLE "_MaterialToModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MaterialToModel_AB_unique" ON "_MaterialToModel"("A", "B");

-- CreateIndex
CREATE INDEX "_MaterialToModel_B_index" ON "_MaterialToModel"("B");

-- AddForeignKey
ALTER TABLE "_MaterialToModel" ADD CONSTRAINT "_MaterialToModel_A_fkey" FOREIGN KEY ("A") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToModel" ADD CONSTRAINT "_MaterialToModel_B_fkey" FOREIGN KEY ("B") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
