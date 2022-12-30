import { IsNotEmpty, IsOptional } from "class-validator";
import { SymptomDto } from "src/symptoms/dto";

export class ReportDto {
  @IsOptional()
  date: Date;

  @IsNotEmpty()
  symptoms: SymptomDto[];
}
