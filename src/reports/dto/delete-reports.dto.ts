import { IsNumber, IsOptional } from "class-validator";

export class DeleteReportsDto {

  @IsOptional()
  @IsNumber({}, { each: true })
  ids: number[];
}