import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { CreateProDto } from './dto';
import { ProService } from './pro.service';

@ApiTags('Pro')

@UseGuards(JwtGuard)
@Controller('pro')
export class ProController {
  constructor(private proService: ProService) {}

  // Post
  @ApiCreatedResponse({description: 'The ressource has been created'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })

  @Post()
  createPro(@Body() dto: CreateProDto) {
    return this.proService.createProFromSubsrciptionRequest(dto);
  }
}
