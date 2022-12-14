import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export  class ProAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}