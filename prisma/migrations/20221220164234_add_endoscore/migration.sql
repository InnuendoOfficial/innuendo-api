-- CreateTable
CREATE TABLE "Endoscore" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Endoscore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Endoscore" ADD CONSTRAINT "Endoscore_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
