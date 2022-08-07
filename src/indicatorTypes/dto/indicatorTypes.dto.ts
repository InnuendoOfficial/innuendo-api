import { UnitMeasure } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class indicatorTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(UnitMeasure)
  @IsNotEmpty()
  unit_measure: UnitMeasure;
}