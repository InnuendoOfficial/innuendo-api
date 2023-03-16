-- AlterTable
ALTER TABLE "Pro" ADD COLUMN     "is_subscription_valid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripe_customer_id" INTEGER NOT NULL DEFAULT 0;
