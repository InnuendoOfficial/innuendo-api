import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiUnauthorizedResponse} from '@nestjs/swagger';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { ResetPasswordDto, UpdateUserDto } from './dto';
@UseInterceptors(SentryInterceptor)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    // GET me
    @ApiUnauthorizedResponse({description: 'Access token unauthorized'})
    @ApiCreatedResponse({description: 'User obtained successfully'})

    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    @UseGuards(JwtGuard)
    @Put('me')
    changeMyInformation(@GetUser() user: User, @Body() dto: UpdateUserDto) {
        return this.userService.updateUser(user, dto);
    }

    // POST delete
    @ApiInternalServerErrorResponse({description: 'Internal server error occured'})
    @ApiCreatedResponse({description: 'User deleted successfully'})

    @UseGuards(JwtGuard)
    @Post('delete')
    deleteMe(@GetUser() user: User, @Body('desactivate') desactivate: Boolean) {
        return this.userService.deleteById(user, desactivate);
    }

    @Post('password/forgot')
    startResetPassword(@Body('email') email: string) {
        return this.userService.sendResetPasswordLink(email)
    }

    @Post('password/reset')
    resetPassword(@Body() dto: ResetPasswordDto) {
        return this.userService.resetPassword(dto)
    }

    @UseGuards(JwtGuard)
    @Post("device_id")
    linkDeviceId(@GetUser() user: User, @Body("device_id") deviceId: string) {
        return this.userService.linkDeviceId(user, deviceId);
    }
}
