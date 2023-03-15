import { IsNumber, IsString } from "class-validator";

export class CreateProDto {
  @IsString()
  first_name: string

  @IsString()
  last_name: string

  @IsString()
  email: string

  @IsNumber()
  phone: number

  @IsString()
  subscription_type: string
}