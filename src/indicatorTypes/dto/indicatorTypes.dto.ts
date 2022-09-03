import { ApiProperty } from '@nestjs/swagger';
import { UnitMeasure } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class indicatorTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({enum: UnitMeasure})
  @IsEnum(UnitMeasure)
  @IsNotEmpty()
  unit_measure: UnitMeasure;
}
