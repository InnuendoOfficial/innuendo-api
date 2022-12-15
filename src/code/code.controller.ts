import { Controller, Get, Post, UseGuards, Body, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CodeService } from './code.service';

@ApiTags('Code')

@UseGuards(JwtGuard)
@Controller('code')
export class CodeController {
  constructor(private codeService: CodeService) {}

  // GET /current

  @Get('/current')
  getCurrentCode(@GetUser() user: User) {
    return this.codeService.getCurrentCode(user);
  }


  // POST

  @Post()
  generateCode(@GetUser() user: User, @Body() dto: any) {
    return this.codeService.generateCode(user, dto);
  }


  // DELETE

  @Delete()
  deleteCode(@GetUser() user: User) {
    return this.codeService.deleteCode(user);
  }
}
