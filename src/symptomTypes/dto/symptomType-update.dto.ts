import { UnitMeasure } from "@prisma/client";
import { IsOptional, IsString } from "class-validator";

export class UpdateSymptomTypeDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  unit_measure: UnitMeasure;
}