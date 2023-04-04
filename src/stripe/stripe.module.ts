import { Module } from '@nestjs/common';
import { ProModule } from 'src/pro/pro.module';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
  imports: [ProModule],
  controllers: [StripeController],
  providers: [StripeService]
})
export class StripeModule {}
