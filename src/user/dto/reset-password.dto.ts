import { IsNotEmpty, IsNumber } from "class-validator"

export class ResetPasswordDto {
    @IsNumber()
    @IsNotEmpty()
    code: number

    @IsNotEmpty()
    password: string
}