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
import { EndoscoresModule } from './endoscores/endoscores.module';
import { MailModule } from './mail/mail.module';
import { StripeModule } from './stripe/stripe.module';
import { SendgridService } from './sendgrid/sendgrid.service';
import { SendgridModule } from './sendgrid/sendgrid.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsService } from './notifications/notifications.service';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ScheduleModule.forRoot(),
    UserModule,
    PrismaModule,
    IndicatorTypesModule,
    ReportsModule,
    IndicatorsModule,
    NewsletterModule,
    SubscriptionRequestModule,
    ProModule,
    CodeModule,
    EndoscoresModule,
    MailModule,
    StripeModule,
    SendgridModule,
  ],
  providers: [SymptomsService, SendgridService, NotificationsService],
})
export class AppModule {}
