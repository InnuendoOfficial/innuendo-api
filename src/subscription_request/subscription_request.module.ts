import { Module } from '@nestjs/common';
import { SubscriptionRequestController } from './subscription_request.controller';
import { SubscriptionRequestService } from './subscription_request.service';

@Module({
  controllers: [SubscriptionRequestController],
  providers: [SubscriptionRequestService]

})
export class SubscriptionRequestModule {}
