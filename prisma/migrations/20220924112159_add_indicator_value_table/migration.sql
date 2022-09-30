/*
  Warnings:

  - You are about to drop the column `value` on the `Indicator` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Indicator" DROP COLUMN "value";

-- CreateTable
CREATE TABLE "IndicatorValue" (
    "id" SERIAL NOT NULL,
    "int" INTEGER,
    "string" TEXT,
    "indicator_id" INTEGER NOT NULL,

    CONSTRAINT "IndicatorValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IndicatorValue_indicator_id_key" ON "IndicatorValue"("indicator_id");

-- AddForeignKey
ALTER TABLE "IndicatorValue" ADD CONSTRAINT "IndicatorValue_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "Indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
