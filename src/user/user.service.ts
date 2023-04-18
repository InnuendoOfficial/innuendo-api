import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { throwError } from 'rxjs';
import { User } from '@prisma/client';

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
    async linkDeviceId(user: User, deviceId: string) {
        if (!deviceId) throw new BadRequestException('device_id is null');
        try {
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    device_id: deviceId
                }
            })
            return 'Device successfully added.';
        } catch (error) {
            throw error;
        }
    }
}
