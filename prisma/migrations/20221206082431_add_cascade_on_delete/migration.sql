-- DropForeignKey
ALTER TABLE "AccessCodePreferences" DROP CONSTRAINT "AccessCodePreferences_access_code_id_fkey";

-- AddForeignKey
ALTER TABLE "AccessCodePreferences" ADD CONSTRAINT "AccessCodePreferences_access_code_id_fkey" FOREIGN KEY ("access_code_id") REFERENCES "AccessCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
