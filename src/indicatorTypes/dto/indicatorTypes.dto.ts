import { UnitMeasure } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class indicatorTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  unit_measure: UnitMeasure;
}
