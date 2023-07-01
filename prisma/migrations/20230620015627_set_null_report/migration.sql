-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_user_id_fkey";

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "user_id" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
