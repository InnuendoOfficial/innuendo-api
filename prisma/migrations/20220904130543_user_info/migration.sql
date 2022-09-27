-- CreateEnum
CREATE TYPE "UnitMeasure" AS ENUM ('INT', 'STRING');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndicatorType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unit_measure" "UnitMeasure" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndicatorType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Indicator" (
    "id" SERIAL NOT NULL,
    "value" JSONB,
    "indicator_type_id" INTEGER NOT NULL,

    CONSTRAINT "Indicator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Indicator_indicator_type_id_key" ON "Indicator"("indicator_type_id");

-- AddForeignKey
ALTER TABLE "Indicator" ADD CONSTRAINT "Indicator_indicator_type_id_fkey" FOREIGN KEY ("indicator_type_id") REFERENCES "IndicatorType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
