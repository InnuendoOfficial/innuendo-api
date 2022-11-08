import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { SubscriptionRequestDto } from './dto';
import { SubscriptionRequestService } from './subscription_request.service';

@ApiTags('Subscription Requests')
@Controller('subscription-requests')
export class SubscriptionRequestController {
  constructor(private subscriptionRequestService: SubscriptionRequestService) {}

  // GET
  @ApiOkResponse({description: 'The resources were returned successfully'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })

  @Get()
  getSubscriptionRequests() {
    return this.subscriptionRequestService.findAllSubscriptionRequests();
  }


  // POST
  @ApiCreatedResponse({description: 'The ressource has been created'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiUnprocessableEntityResponse({description: 'The body contains not wanted content'})

  @Post()
  createSubscriptionRequest(@Body() dto: SubscriptionRequestDto) {
    return this.subscriptionRequestService.createSubscriptionRequest(dto)
  }
}
