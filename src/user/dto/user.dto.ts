import { IsNotEmpty, IsNumber } from "class-validator";

export class UserDto {
    @IsNumber()
    @IsNotEmpty()
    id: number
}