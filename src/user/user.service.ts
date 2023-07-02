import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { ResetPasswordDto, UpdateUserDto } from './dto';
import { MailService } from 'src/mail/mail.service';
import * as argon from 'argon2';


@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private mailingService: MailService) {}

    private generateRandom(): number {
        const min = 1000;
        const max = 999999;
    
        let difference = max - min;
    
        let rand = Math.random();
    
        rand = Math.floor( rand * difference);
    
        rand = rand + min;
        return rand;
    }

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

    async sendResetPasswordLink(email: string) {
        if (!email) {
            throw new NotFoundException("user doesn't exist.")
          }
        try {
          const user = await this.prisma.user.findUnique({
            where: { email: email }
          })
          console.log(user, email)
          if (!user) {
            throw new NotFoundException("user doesn't exist.")
          }
          const code = await this.prisma.passwordResetCode.create({
            data: {
                value: this.generateRandom(),
                email: user.email
            }
          })
          await this.mailingService.sendForgottenPasswordLink(user.firstname, user.email, `https://innuendo-app.herokuapp.com/reset?code=${code.value}`);
          return 'email sent.'
        } catch (error) {
            throw error;
        }
    }

    async resetPassword(dto: ResetPasswordDto) {
        if (!dto.code) {
            throw new NotFoundException("You must provide a code.")
        }
        try {
            const resetCode = await this.prisma.passwordResetCode.findFirst({
                where: { value: dto.code }
            })
            if (!resetCode) {
                throw new NotFoundException("Code is not valid.")
            }
            await this.prisma.user.update({
                where: { email: resetCode.email },
                data: { hash: await argon.hash(dto.password) }
            })
            return 'password changed.';
        } catch (error) {
            throw error;
        }
    }
}
