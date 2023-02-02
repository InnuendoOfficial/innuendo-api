import { IsNumber, IsOptional, IsString } from "class-validator"

export class ProDto {
  @IsString()
  @IsOptional()
  first_name: string

  @IsString()
  @IsOptional()
  last_name: string

  @IsString()
  @IsOptional()
  email: string

  @IsNumber()
  @IsOptional()
  phone: number

  @IsString()
  @IsOptional()
  subscription_type: string
}