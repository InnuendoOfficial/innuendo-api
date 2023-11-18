-- DropForeignKey
ALTER TABLE "Symptom" DROP CONSTRAINT "Symptom_symptom_type_id_fkey";

-- AddForeignKey
ALTER TABLE "Symptom" ADD CONSTRAINT "Symptom_symptom_type_id_fkey" FOREIGN KEY ("symptom_type_id") REFERENCES "SymptomType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
