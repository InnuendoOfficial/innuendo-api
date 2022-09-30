/*
  Warnings:

  - A unique constraint covering the columns `[report_id]` on the table `Indicator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `report_id` to the `Indicator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Indicator" ADD COLUMN     "report_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_user_id_key" ON "Report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Indicator_report_id_key" ON "Indicator"("report_id");

-- AddForeignKey
ALTER TABLE "Indicator" ADD CONSTRAINT "Indicator_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
