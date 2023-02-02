/*
  Warnings:

  - Made the column `phone` on table `Pro` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subscription_type` on table `Pro` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Pro" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "subscription_type" SET NOT NULL;
