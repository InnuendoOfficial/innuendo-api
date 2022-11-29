/*
  Warnings:

  - You are about to drop the column `indicator_type_id` on the `Symptom` table. All the data in the column will be lost.
  - You are about to drop the column `indicator_id` on the `SymptomValue` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[symptom_id]` on the table `SymptomValue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `symptom_type_id` to the `Symptom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symptom_id` to the `SymptomValue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Symptom" DROP CONSTRAINT "Symptom_indicator_type_id_fkey";

-- DropForeignKey
ALTER TABLE "SymptomValue" DROP CONSTRAINT "SymptomValue_indicator_id_fkey";

-- DropIndex
DROP INDEX "SymptomValue_indicator_id_key";

-- AlterTable
ALTER TABLE "Symptom" DROP COLUMN "indicator_type_id",
ADD COLUMN     "symptom_type_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SymptomValue" DROP COLUMN "indicator_id",
ADD COLUMN     "symptom_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SymptomValue_symptom_id_key" ON "SymptomValue"("symptom_id");

-- AddForeignKey
ALTER TABLE "Symptom" ADD CONSTRAINT "Symptom_symptom_type_id_fkey" FOREIGN KEY ("symptom_type_id") REFERENCES "SymptomType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SymptomValue" ADD CONSTRAINT "SymptomValue_symptom_id_fkey" FOREIGN KEY ("symptom_id") REFERENCES "Symptom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
