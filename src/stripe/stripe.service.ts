import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pro } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProService } from 'src/pro/pro.service';
import Stripe from 'stripe';
import * as argon from 'argon2';

@Injectable()
export class StripeService {
  constructor(private prisma: PrismaService, private config: ConfigService, private mailService: MailService, private proService: ProService) {}

  private stripe = new Stripe(this.config.get('STRIPE_API_KEY'), {
    apiVersion: '2022-11-15'
  })

  async getSubscriptionRedirection(pro: Pro) {
    const customer = await this.stripe.customers.create({
      email: pro.email
    })
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: 'price_1MjEshKRZVlrydWnXqHWrFxj',
          quantity: 1,
        },
      ],
      success_url: 'https://innuendo-app.herokuapp.com/paiementsucceed?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://innuendo-app.herokuapp.com/paiementfailed',
      customer: customer.id
    })
    try {
      await this.prisma.stripeCustomer.create({
        data: {
          customer_id: customer.id,
          pro_id: pro.id
        }
      })
    } catch (error) {
      throw error;
    }
    await this.mailService.sendPaymentLink(pro, session.url)
    return session.url;
  }

  async manageWebhook(body, headers) {
    switch (body.type) {
      case 'checkout.session.completed':
        try {
          const password = this.proService.generatePassword();
          const stripeCustomer = await this.prisma.stripeCustomer.findUnique({
            where: { customer_id: body.data.object.customer }
          })
          const user = await this.prisma.pro.update({
            where: { id: stripeCustomer.pro_id },
            data: {
              is_subscription_valid: true,
              hash: await argon.hash(password)
            }
          })
          await this.mailService.sendCredentialsEmail(user, password);
        } catch (error) {
          throw error;
        }
        break;
      case 'invoice.paid':
        // Continue to provision the subscription as payments continue to be made.
        // Store the status in your database and check when a user accesses your service.
        // This approach helps you avoid hitting rate limits.
        break;
      case 'invoice.payment_failed':
        // The payment failed or the customer does not have a valid payment method.
        // The subscription becomes past_due. Notify your customer and send them to the
        // customer portal to update their payment information.
        break;
    }
    return 'webhook success';
  }
}
