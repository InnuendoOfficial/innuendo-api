import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiUnauthorizedResponse} from '@nestjs/swagger';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from 'src/sentry.interceptor';
@UseInterceptors(SentryInterceptor)
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    // GET me
    @ApiUnauthorizedResponse({description: 'Access token unauthorized'})
    @ApiCreatedResponse({description: 'User obtained successfully'})

    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    // POST delete
    @ApiInternalServerErrorResponse({description: 'Internal server error occured'})
    @ApiCreatedResponse({description: 'User deleted successfully'})

    @Post('delete')
    deleteMe(@GetUser() user: User, @Body('desactivate') desactivate: boolean) {
        return this.userService.deleteById(user, desactivate);
    }
    @Post("device_id")
    linkDeviceId(@GetUser() user: User, @Body("device_id") deviceId: string) {
        return this.userService.linkDeviceId(user, deviceId);
    }
}
