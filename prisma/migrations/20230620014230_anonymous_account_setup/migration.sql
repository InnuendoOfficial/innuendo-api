/*
  Warnings:

  - You are about to drop the column `activated` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_user_id_fkey";

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "user_id" SET DEFAULT -1;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "activated";

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;
