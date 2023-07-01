import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { throwError } from 'rxjs';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async deleteById(user, desactivate) {
        if (!user) {
            throw new ForbiddenException('id ' + user.id + ' does not exist')
        }
        try {
            if (desactivate == false || desactivate == 'false') {
                const res = await this.prisma.report.deleteMany({
                    where: { user_id: user.id }
                })
            }
            await this.prisma.user.delete({
                where: {
                    id: user.id
                }
            });
        } catch (error) {
            throw error;
        }
        return 'user ' + user.id + ' has been successfully deleted'
    }

    async updateUser(user: User, dto: UpdateUserDto) {
        try {
            const res = await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    ...dto
                }
            })
            delete res.hash;
            return res;
        } catch (error) {
            throw error;
        }
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
