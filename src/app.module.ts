import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { IndicatorTypesModule } from './symptomTypes/symptomTypes.module';
import { UserModule } from './user/user.module';
import { ReportsModule } from './reports/reports.module';
import { SymptomsService } from './symptoms/symptoms.service';
import { IndicatorsModule } from './symptoms/symptoms.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { SubscriptionRequestModule } from './subscription_request/subscription_request.module';
import { ProModule } from './pro/pro.module';
import { CodeModule } from './code/code.module';
import { ReportsService } from './reports/reports.service';
import { AuthService } from './auth/auth.service';

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
    CodeModule,
  ],
  providers: [SymptomsService],
})
export class AppModule {}
