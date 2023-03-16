import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProDto {
  @IsNotEmpty()
  @IsString()
  first_name: string

  @IsNotEmpty()
  @IsString()
  last_name: string

  @IsNotEmpty()
  @IsString()
  email: string

  @IsNotEmpty()
  @IsNumber()
  phone: number

  @IsNotEmpty()
  @IsString()
  subscription_type: string
}