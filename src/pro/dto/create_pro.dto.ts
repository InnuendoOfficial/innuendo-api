import { IsNumber } from "class-validator";

export class CreateProDto {
  @IsNumber()
  subscription_request_id: number
}