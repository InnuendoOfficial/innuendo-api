import { Body, Controller, Get, Put, Delete, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import { UserDto } from './dto';

@UseGuards(JwtGuard)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // GET me
  @ApiUnauthorizedResponse({ description: 'Access token unauthorized' })
  @ApiOkResponse({ description: 'User obtained successfully' })
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  // PUT
  @ApiNoContentResponse({
    description: 'Ressource has been updated successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'The ressource does not exist' })
  @Put('update')
  updateUser(@GetUser() user: User, @Body() dto: UserDto) {
    return this.userService.updateUser(user, dto);
  }

  // POST delete
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured',
  })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'The ressource does not exist' })
  @Delete('delete')
  deleteMe(@GetUser() user: User) {
    return this.userService.deleteUser(user);
  }
}
