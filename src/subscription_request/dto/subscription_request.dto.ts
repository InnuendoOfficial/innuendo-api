import { IsEmail, IsNumber, IsString } from "class-validator"

export class SubscriptionRequestDto {
  @IsString()
  first_name: string

  @IsString()
  last_name: string

  @IsString()
  @IsEmail()
  email: string

  @IsNumber()
  phone: number

  @IsNumber()
  age: number

  @IsString()
  occupation: string

  @IsString()
  wanted_licenses: string
  
  @IsString()
  subscription_type: string
}