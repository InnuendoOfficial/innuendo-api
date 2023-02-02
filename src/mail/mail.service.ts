import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Pro } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendForgottenPasswordEmail(user: Pro, newPassword: string) {

    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'innuendo.contact@gmail.com',
        subject: 'Nouveau mot de passe',
        text: 'heheheh',
        template: './forgotten_password',
        context: {
          name: user.first_name
        }
      });
    } catch (error) {
      console.log(error)
    }
  }
}