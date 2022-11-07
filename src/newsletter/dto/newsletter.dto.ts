import { IsOptional, IsString } from "class-validator";

export class NewsletterDto {
  @IsString()
  name: string;

  @IsString()
  'exemple-email.com': string;

  @IsString()
  Message: string;
}