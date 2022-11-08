import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { IndicatorTypesModule } from './indicatorTypes/indicatorTypes.module';
import { UserModule } from './user/user.module';
import { ReportsModule } from './reports/reports.module';
import { IndicatorsService } from './indicators/indicators.service';
import { IndicatorsModule } from './indicators/indicators.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { SubscriptionRequestModule } from './subscription_request/subscription_request.module';
import { ProController } from './pro/pro.controller';
import { ProModule } from './pro/pro.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    IndicatorTypesModule,
    ReportsModule,
    IndicatorsModule,
    NewsletterModule,
    SubscriptionRequestModule,
    ProModule,
  ],
  providers: [IndicatorsService],
})
export class AppModule {}
