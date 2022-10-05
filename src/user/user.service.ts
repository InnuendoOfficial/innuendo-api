import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async deleteUser(user: User) {
    if (!user) {
      throw new ForbiddenException('id ' + user.id + ' does not exist');
    }
    await this.prisma.user.delete({
      where: {
        id: user.id,
      },
    });
    return 'user ' + user.id + ' has been successfully deleted';
  }

  async updateUser(user: User, dto: UserDto) {
    if (!user) {
      throw new ForbiddenException('id ' + user.id + ' does not exist');
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        firstname: dto.firstname,
        lastname: dto.lastname,
      },
    });
    return 'user ' + user.id + ' has been successfully updated';
  }
}
