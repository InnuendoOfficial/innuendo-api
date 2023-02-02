import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "smtp.sendgrid.net",
        port: 25,
        secure : false,
        auth: {
          user: 'apikey',
          pass: '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'
        },
        tls: {
          rejectUnauthorized: false
        },
      },
      defaults: {
        from: 'innuendo.contact@gmail.com',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    })
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
