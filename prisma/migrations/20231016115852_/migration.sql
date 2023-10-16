-- AlterEnum
ALTER TYPE "UnitMeasure" ADD VALUE 'bool';

-- AlterTable
ALTER TABLE "SymptomValue" ADD COLUMN     "bool" BOOLEAN;
