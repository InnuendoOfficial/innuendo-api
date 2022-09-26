import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

export class reportQueriesDto {
  @IsOptional()
  start: string;

  @IsOptional()
  end: string;

  @IsOptional()
  @Transform(obj => +obj.value)
  offset: number;

  @IsOptional()
  @Transform(obj => +obj.value)
  limit: number;
}