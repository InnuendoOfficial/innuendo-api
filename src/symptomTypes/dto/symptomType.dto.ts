import { UnitMeasure } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class symptomTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  unit_measure: UnitMeasure;
}
