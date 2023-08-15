import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { Pro, User } from '@prisma/client';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Get(':tag')
  emailPreview(@Param('tag') emailTag: string) {
    return this.mailService.emailPreview(emailTag);
  }

  @UseGuards(JwtGuard)
  @Post('/send/team')
  sendEmailToTeam(@GetUser() user: Pro, @Body('text') text: string, @Body('type') type: string) {
    return this.mailService.sendEmailToTeamInnuendo(user, text, type);
  }

  @Post('/send')
  sendEmail(@Body('contacts') list: Array<string>, @Body('text') text: string) {
    return this.mailService.sendEmailToContactList(list,text);
  }

}
