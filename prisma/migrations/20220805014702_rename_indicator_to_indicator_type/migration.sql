/*
  Warnings:

  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Indicator` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstName",
ADD COLUMN     "first_name" TEXT;

-- DropTable
DROP TABLE "Indicator";

-- CreateTable
CREATE TABLE "IndicatorType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unit_measure" "UnitMeasure" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndicatorType_pkey" PRIMARY KEY ("id")
);
