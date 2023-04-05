import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Get(':tag')
  emailPreview(@Param('tag') emailTag: string) {
    return this.mailService.emailPreview(emailTag);
  }

  @Post('/send')
  sendEmail(@Body('contacts') list: Array<string>, @Body('text') text: string) {
    return this.mailService.sendEmailToContactList(list,text);
  }
}
