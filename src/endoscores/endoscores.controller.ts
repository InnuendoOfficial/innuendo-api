import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { EndoscoresService } from './endoscores.service';

@ApiTags('Endoscore')

@UseGuards(JwtGuard)
@Controller('endoscores')
export class EndoscoresController {
  constructor(private endoscoreService: EndoscoresService) {}

  // GET
  @Get()
  getAllEndoscores(@GetUser() user: User) {
    return this.endoscoreService.findAllEndscores(user);
  }

  @Get('current')
  getCurrentEndoscore(@GetUser() user: User) {
    return this.endoscoreService.findLastEndoscore(user);
  }

  // POST
  @Post()
  createEndoscore(@GetUser() user: User) {
    return this.endoscoreService.createEndoscore(user);
  }
}
