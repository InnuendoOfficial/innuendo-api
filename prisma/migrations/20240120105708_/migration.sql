-- DropForeignKey
ALTER TABLE "StripeCustomer" DROP CONSTRAINT "StripeCustomer_pro_id_fkey";

-- AddForeignKey
ALTER TABLE "StripeCustomer" ADD CONSTRAINT "StripeCustomer_pro_id_fkey" FOREIGN KEY ("pro_id") REFERENCES "Pro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
