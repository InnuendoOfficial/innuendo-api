import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pro } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';
import * as argon from 'argon2';

@Injectable()
export class StripeService {
  constructor(private prisma: PrismaService, private config: ConfigService, private mailService: MailService) {}

  private stripe = new Stripe(this.config.get('STRIPE_API_KEY'), {
    apiVersion: '2022-11-15'
  })

  generatePassword() {
    return Math.random().toString(36).slice(-8);
  }

  async getSubscriptionRedirection(pro: Pro, reccurence: string = 'monthly') {
    if (pro.is_subscription_valid)
      throw new BadRequestException('User already subscribed.');
    if (reccurence != 'monthly' && reccurence != 'yearly')
      throw new BadRequestException('reccurence should be monthly or yearly.')
    const products = {
      monthly: {
        price: 'price_1MjEshKRZVlrydWnXqHWrFxj',
        quantity: 1,
      },
      yearly: {
        price: 'price_1NjkERKRZVlrydWnCPc2UMnm',
        quantity: 1,
      },
    }
    const customer = await this.stripe.customers.create({
      email: pro.email
    })
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [ products[reccurence] ],
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
      await this.prisma.pro.update({
        where: { id: pro.id },
        data: { subscription_type: reccurence }
      })
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Link already sent.');
    }
    await this.mailService.sendPaymentLink(pro, session.url)
    return session.url;
  }

  async cancelSubscription(user: Pro) {
    try {
      const stripeId = await this.prisma.stripeCustomer.findFirst({
        where: { pro_id: user.id }
      });
      const customer = await this.stripe.customers.retrieve(stripeId.customer_id, {
        expand: ['subscriptions']
      })
      console.log(customer);
      await this.stripe.subscriptions.del(customer['subscriptions'].data[0].id);
      return 'subscription canceled.'
    } catch (error) {
      throw error;
    }
  }

  async manageWebhook(body, headers) {
    console.log('webhook type', body.type);
    switch (body.type) {
      case 'checkout.session.completed':
        try {
          const password = this.generatePassword();
          const stripeCustomer = await this.prisma.stripeCustomer.findUnique({
            where: { customer_id: body.data.object.customer }
          })
          const user = await this.prisma.pro.findUnique({ where: { id: stripeCustomer.pro_id } })
          const now = new Date()
          const nextPaymentDate = user.subscription_type == 'monthly' ? new Date(now.setMonth(now.getMonth() + 1)) :
                                                                        new Date(now.setFullYear(now.getFullYear() + 1))
          const userUpdated = await this.prisma.pro.update({
            where: { id: stripeCustomer.pro_id },
            data: {
              is_subscription_valid: true,
              hash: await argon.hash(password),
              last_payment_date: new Date().toString(),
              next_payment_date: nextPaymentDate.toString()
            }
          })
          await this.mailService.sendCredentialsEmail(userUpdated, password);
        } catch (error) {
          throw error;
        }
        break;
      case 'customer.subscription.deleted':
        try {
          const stripeCustomer = await this.prisma.stripeCustomer.findUnique({
            where: { customer_id: body.data.object.customer }
          })
          await this.prisma.pro.update({
            where: { id: stripeCustomer.pro_id },
            data: {
              is_subscription_valid: false,
            }
          })
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
