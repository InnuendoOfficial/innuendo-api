import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Global()
@Module({
  imports: [],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController]
})
export class MailModule {}
