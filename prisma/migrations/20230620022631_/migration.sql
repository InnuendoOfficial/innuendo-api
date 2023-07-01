-- DropForeignKey
ALTER TABLE "AccessCode" DROP CONSTRAINT "AccessCode_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Endoscore" DROP CONSTRAINT "Endoscore_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Endoscore" ADD CONSTRAINT "Endoscore_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessCode" ADD CONSTRAINT "AccessCode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
