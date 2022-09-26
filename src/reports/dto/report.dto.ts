import { IsNotEmpty, IsOptional } from "class-validator";
import { IndicatorDto } from "src/indicators/dto";

export class ReportDto {
  @IsOptional()
  date: Date;

  @IsNotEmpty()
  indicators: IndicatorDto[];
}
