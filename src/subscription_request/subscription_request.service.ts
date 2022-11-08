import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscriptionRequestDto } from './dto';

@Injectable()
export class SubscriptionRequestService {
  constructor(private prisma: PrismaService) {}

  async findAllSubscriptionRequests() {
    try {
      const subscriptionRequests = await this.prisma.subscriptionRequest.findMany();
      return subscriptionRequests;
    } catch (error) {
      throw error;
    }
  }

  async createSubscriptionRequest(dto: SubscriptionRequestDto) {
    try {
      const subscriptionRequest = await this.prisma.subscriptionRequest.create({
        data: {
          ...dto
        }
      });
      return subscriptionRequest;
    } catch (error) {
      throw error;
    }
  }
}
