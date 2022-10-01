-- DropForeignKey
ALTER TABLE "IndicatorValue" DROP CONSTRAINT "IndicatorValue_indicator_id_fkey";

-- AddForeignKey
ALTER TABLE "IndicatorValue" ADD CONSTRAINT "IndicatorValue_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "Indicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
