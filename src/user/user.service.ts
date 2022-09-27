import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async deleteById(user) {
        if (!user) {
            throw new ForbiddenException('id ' + user.id + ' does not exist')
        }
        await this.prisma.user.delete({
            where: {
                id: user.id
            }
        });
        return 'user ' + user.id + ' has been successfully deleted'
    }
}
