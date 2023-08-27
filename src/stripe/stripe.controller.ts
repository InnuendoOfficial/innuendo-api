import { ConsoleLogger, Controller, Get, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Delete, Headers, Post, Query, Req } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { Pro } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { StripeService } from './stripe.service';

@ApiTags('Stripe')

@UseInterceptors(SentryInterceptor)
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @UseGuards(JwtGuard)
  @Get('subscription')
  async subscribe(@GetUser() user: Pro, @Query('reccurence') reccurence: string) {
    return this.stripeService.getSubscriptionRedirection(user, reccurence);
  }

  @UseGuards(JwtGuard)
  @Delete('subscription')
  async cancelSubscription(@GetUser() user: Pro) {
    return this.stripeService.cancelSubscription(user);
  }

  @Post('webhook')
  async webhook(@Req() req, @Headers() headers) {
    return this.stripeService.manageWebhook(req.body, headers);
  }
}