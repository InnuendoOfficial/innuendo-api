/*
  Warnings:

  - You are about to drop the column `stripe_customer_id` on the `Pro` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pro" DROP COLUMN "stripe_customer_id";

-- CreateTable
CREATE TABLE "StripeCustomer" (
    "id" SERIAL NOT NULL,
    "customer_id" TEXT NOT NULL,
    "pro_id" INTEGER NOT NULL,

    CONSTRAINT "StripeCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_customer_id_key" ON "StripeCustomer"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_pro_id_key" ON "StripeCustomer"("pro_id");

-- AddForeignKey
ALTER TABLE "StripeCustomer" ADD CONSTRAINT "StripeCustomer_pro_id_fkey" FOREIGN KEY ("pro_id") REFERENCES "Pro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
