import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { RefreshJwtGuard } from './guard/refresh-jwt.guard';

@ApiTags('Auth')
@Controller('auth')
export class authController {
  constructor(private authService: AuthService) {}

  // POST signup
  @ApiCreatedResponse({description: 'The ressource has been created'})
  @ApiForbiddenResponse({description: 'Account already taken'})
  @ApiBadRequestResponse({description: 'Information missing'})

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  // POST login
  @ApiCreatedResponse({description: 'User successfully connected'})
  @ApiForbiddenResponse({description: 'Incorrect password'})
  @ApiNotFoundResponse({description: "Information missing or user doesn't exist"})
  
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}
