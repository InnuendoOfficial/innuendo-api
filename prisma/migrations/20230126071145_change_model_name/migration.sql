/*
  Warnings:

  - You are about to drop the `pro` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "pro";

-- CreateTable
CREATE TABLE "Pro" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "Pro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pro_email_key" ON "Pro"("email");
