import { IsDefined, IsNumber, IsOptional } from "class-validator";

export class SymptomDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNumber()
  symptom_type_id: number;

  @IsDefined()
  value: any;
}