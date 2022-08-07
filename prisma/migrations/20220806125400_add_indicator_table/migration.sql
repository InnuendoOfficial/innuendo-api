-- CreateTable
CREATE TABLE "Indicator" (
    "id" SERIAL NOT NULL,
    "value" JSONB,
    "indicator_type_id" INTEGER NOT NULL,

    CONSTRAINT "Indicator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Indicator_indicator_type_id_key" ON "Indicator"("indicator_type_id");

-- AddForeignKey
ALTER TABLE "Indicator" ADD CONSTRAINT "Indicator_indicator_type_id_fkey" FOREIGN KEY ("indicator_type_id") REFERENCES "IndicatorType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
