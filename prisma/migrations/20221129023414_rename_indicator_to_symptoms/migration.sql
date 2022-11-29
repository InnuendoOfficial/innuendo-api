/*
  Warnings:

  - You are about to drop the `Indicator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IndicatorType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IndicatorValue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Indicator" DROP CONSTRAINT "Indicator_indicator_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Indicator" DROP CONSTRAINT "Indicator_report_id_fkey";

-- DropForeignKey
ALTER TABLE "IndicatorValue" DROP CONSTRAINT "IndicatorValue_indicator_id_fkey";

-- DropTable
DROP TABLE "Indicator";

-- DropTable
DROP TABLE "IndicatorType";

-- DropTable
DROP TABLE "IndicatorValue";

-- CreateTable
CREATE TABLE "SymptomType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unit_measure" "UnitMeasure" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SymptomType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Symptom" (
    "id" SERIAL NOT NULL,
    "indicator_type_id" INTEGER NOT NULL,
    "report_id" INTEGER NOT NULL,

    CONSTRAINT "Symptom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SymptomValue" (
    "id" SERIAL NOT NULL,
    "int" INTEGER,
    "string" TEXT,
    "indicator_id" INTEGER NOT NULL,

    CONSTRAINT "SymptomValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SymptomValue_indicator_id_key" ON "SymptomValue"("indicator_id");

-- AddForeignKey
ALTER TABLE "Symptom" ADD CONSTRAINT "Symptom_indicator_type_id_fkey" FOREIGN KEY ("indicator_type_id") REFERENCES "SymptomType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Symptom" ADD CONSTRAINT "Symptom_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SymptomValue" ADD CONSTRAINT "SymptomValue_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "Symptom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
