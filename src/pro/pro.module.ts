import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ReportsModule } from 'src/reports/reports.module';
import { ProController } from './pro.controller';
import { ProService } from './pro.service';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [ReportsModule, AuthModule, StripeModule],
  controllers: [ProController],
  providers: [ProService],
  exports: [ProService]
})
export class ProModule {}
