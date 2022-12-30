import { Body, Controller, Get, Post, UseGuards,Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { CreateProDto } from './dto';
import { ProAuthDto } from './dto/auth.dto';
import { ProService } from './pro.service';
import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from 'src/sentry.interceptor';
@ApiTags('Pro')

@UseInterceptors(SentryInterceptor)
@Controller('pro')
export class ProController {
  constructor(private proService: ProService) {}

  // GET
  @UseGuards(JwtGuard)
  @Get('/patient/datas')
  getPatientDatas(@Query('code') code) {
    return this.proService.getPatientDatasFromCode(+code);
  }

  @UseGuards(JwtGuard)
  @Get('/patient/profile')
  getPatientProfile(@Query("code") code) {
    return this.proService.getPatientProfileFromCode(+code);
  }

  @UseGuards(JwtGuard)
  @Get('/patients')
  getPatients() {
    return this.proService.getPatients();
  }


  // POST
  @ApiCreatedResponse({description: 'The ressource has been created'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })

  @UseGuards(JwtGuard)
  @Post()
  createPro(@Body() dto: CreateProDto) {
    return this.proService.createProFromSubsrciptionRequest(dto);
  }

  @Post('/login')
  login(@Body() dto: ProAuthDto) {
    return this.proService.login(dto);
  }
}
