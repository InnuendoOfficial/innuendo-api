/*
  Warnings:

  - You are about to drop the column `email_` on the `pro` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `pro` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `pro` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "pro_email__key";

-- AlterTable
ALTER TABLE "pro" DROP COLUMN "email_",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pro_email_key" ON "pro"("email");
