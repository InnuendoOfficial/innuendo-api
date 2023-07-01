import { EndoStatus } from "@prisma/client"
import { IsOptional, IsString } from "class-validator"

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    firstname: string

    @IsString()
    @IsOptional()
    lastname: string

    @IsOptional()
    has_endometriosis: EndoStatus
}