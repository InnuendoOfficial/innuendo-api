-- DropForeignKey
ALTER TABLE "Indicator" DROP CONSTRAINT "Indicator_report_id_fkey";

-- AddForeignKey
ALTER TABLE "Indicator" ADD CONSTRAINT "Indicator_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
