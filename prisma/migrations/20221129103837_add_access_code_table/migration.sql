-- CreateTable
CREATE TABLE "AccessCode" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "AccessCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessCodePreferences" (
    "id" SERIAL NOT NULL,
    "symptom_id" INTEGER NOT NULL,
    "showable" BOOLEAN NOT NULL,
    "access_code_id" INTEGER NOT NULL,

    CONSTRAINT "AccessCodePreferences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccessCode" ADD CONSTRAINT "AccessCode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessCodePreferences" ADD CONSTRAINT "AccessCodePreferences_access_code_id_fkey" FOREIGN KEY ("access_code_id") REFERENCES "AccessCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
