import { Body, Controller, Get, Post, UseGuards, Query, Put, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { CreateProDto, ProDto } from './dto';
import { ProAuthDto } from './dto/auth.dto';
import { ProService } from './pro.service';
import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
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

  @UseGuards(JwtGuard)
  @Get()
  getProInformations(@GetUser() user: User) {
    return this.proService.findProById(user.id)
  }

  @Get('all')
  getAll() {
    return this.proService.getAll()
  }

  // POST
  @ApiCreatedResponse({description: 'The ressource has been created'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })

  @Post()
  createPro(@Body() dto: CreateProDto) {
    return this.proService.createPro(dto);
  }

  @UseGuards(JwtGuard)
  @Put()
  changeProInformations(@GetUser() user: User, @Body() dto: ProDto) {
    return this.proService.updateProById(user.id, dto);
  }

  @Post('/login')
  login(@Body() dto: ProAuthDto) {
    return this.proService.login(dto);
  }

  @UseGuards(JwtGuard)
  @Post('/email')
  changeEmail(@GetUser() user: User, @Body('new_email') newEmail: string) {
    return this.proService.changeEmail(user.id, newEmail);
  }

  @Post('/forgotten_password')
  forgottenPassword(@Body('email') email: string) {
    return this.proService.changePassword(email);
  }

  @UseGuards(JwtGuard)
  @Delete()
  deleteUser(@GetUser() user: User) {
    return this.proService.deletePro(user.id);
  }
}
