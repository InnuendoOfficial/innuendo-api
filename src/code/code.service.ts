import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CodeService {
  constructor(private prisma: PrismaService) {}

  private generateRandom(): number {
    const min = 1000;
    const max = 999999;

    let difference = max - min;

    let rand = Math.random();

    rand = Math.floor( rand * difference);

    rand = rand + min;
    return rand;
  }

  async generateCode(user: User, dto: any) {
    const previousCode = await this.prisma.accessCode.findFirst({
      where: { user_id: user.id }
    })
    if (previousCode) {
      await this.prisma.accessCode.deleteMany({
        where: { user_id: user.id }
      })
    }

    const codeValue = this.generateRandom();

    await this.prisma.accessCode.create({
      data: {
        user_id: user.id,
        value: codeValue,
        preferences: {
          create: dto.preferences
        }
      }
    })
    return { code: codeValue };
  }

  async getCurrentCode(user: User) {
    const previousCode = await this.prisma.accessCode.findFirst({
      where: { user_id: user.id }
    })

    if (!previousCode) {
      throw new NotFoundException('No access code existing for this user.');
    }

    return { code: previousCode.value };
  }

  async deleteCode(user: User) {
    try {
      await this.prisma.accessCode.deleteMany({
        where: { user_id: user.id }
      })
      return { msg: 'Code successfully deleted.' };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Record to delete does not exist.');
      }
      throw error;
    }
  }
}
