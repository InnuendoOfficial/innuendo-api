import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class authController {
  constructor(private authService: AuthService) {}

  // POST signup
  @ApiCreatedResponse({ description: 'The ressource has been created' })
  @ApiForbiddenResponse({ description: 'Account already taken' })
  @ApiBadRequestResponse({ description: 'Information missing' })
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    if (dto.isPro) {
      return this.authService.proSignup(dto);
    } else {
      return this.authService.userSignup(dto);
    }
  }

  // POST login
  @ApiCreatedResponse({ description: 'User successfully connected' })
  @ApiForbiddenResponse({ description: 'Incorrect password' })
  @ApiNotFoundResponse({
    description: "Information missing or user doesn't exist",
  })
  @Post('login')
  login(@Body() dto: AuthDto) {
    if (dto.isPro) {
      return this.authService.proLogin(dto);
    } else {
      return this.authService.userLogin(dto);
    }
  }
}