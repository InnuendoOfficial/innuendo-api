import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async deleteById(user, desactivate: boolean) {
        if (!user) {
            throw new ForbiddenException('id ' + user.id + ' does not exist')
        }
        try {
            if (!desactivate) {
                await this.prisma.report.deleteMany({
                    where: { user_id: user.id }
                })
            }
            console.log(user.id)
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
