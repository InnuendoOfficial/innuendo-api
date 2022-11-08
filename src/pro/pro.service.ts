import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProDto } from './dto';
import * as argon from 'argon2';
import { settings } from 'pactum';
import { SubscriptionRequestDto } from 'src/subscription_request/dto';

@Injectable()
export class ProService {
  constructor(private prisma: PrismaService) {}

  private generatePassword() {
    return Math.random().toString(36).slice(-8);
  }

  async createProFromSubsrciptionRequest(dto: CreateProDto) {
    try {
      const subscription_request: SubscriptionRequestDto = await this.prisma.subscriptionRequest.findFirst({
        where: {
          id: dto.subscription_request_id,
        }
      });
      if (!subscription_request) {
        throw new NotFoundException('Subscription request does not exist.');
      }
      const password: string = this.generatePassword();
      const hash = await argon.hash(password);

      const pro = await this.prisma.pro.create({
        data: {
          first_name: subscription_request.first_name,
          last_name: subscription_request.last_name,
          email: subscription_request.email,
          hash,
        }
      });
      delete pro.hash;
      pro['password'] = password;
      return pro;
    } catch (error) {
      throw error;
    }
  }
}
