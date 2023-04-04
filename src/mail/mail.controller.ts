import { Controller, Get, Param } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Get(':tag')
  emailPreview(@Param('tag') emailTag: string) {
    return this.mailService.emailPreview(emailTag);
  }
}
