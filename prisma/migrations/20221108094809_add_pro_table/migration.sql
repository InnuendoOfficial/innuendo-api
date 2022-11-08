-- CreateTable
CREATE TABLE "pro" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email_" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "pro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pro_email__key" ON "pro"("email_");
