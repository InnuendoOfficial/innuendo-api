/*
  Warnings:

  - The values [INT] on the enum `UnitMeasure` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UnitMeasure_new" AS ENUM ('int', 'STRING');
ALTER TABLE "IndicatorType" ALTER COLUMN "unit_measure" TYPE "UnitMeasure_new" USING ("unit_measure"::text::"UnitMeasure_new");
ALTER TYPE "UnitMeasure" RENAME TO "UnitMeasure_old";
ALTER TYPE "UnitMeasure_new" RENAME TO "UnitMeasure";
DROP TYPE "UnitMeasure_old";
COMMIT;
