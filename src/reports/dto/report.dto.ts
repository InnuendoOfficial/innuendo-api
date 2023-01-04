import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { SymptomDto } from "src/symptoms/dto";

export class ReportDto {
  @IsOptional()
  date: Date;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SymptomDto)
  symptoms: SymptomDto[];
}
