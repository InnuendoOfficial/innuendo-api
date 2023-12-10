import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          lastname: dto.lastname,
          firstname: dto.firstname
        },
      });
      delete user.hash;
      return this.getAccessToken(user.id);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already taken');
        }
      }
      throw error;
    }
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Incorrect email');
    if (!(await argon.verify(user.hash, dto.password)))
      throw new ForbiddenException('Incorrect password');
    delete user.hash;
    return this.getAccessToken(user.id);
  }

  async refreshToken(user: User, refresh_token: string) {
    return {
      expires_in: 3600,
      refresh_token,
      access_token: await this.jwt.signAsync({ id: user.id }, {
        expiresIn: '60m',
        secret: this.config.get('JWT_SECRET'),
      }),
    };
  }

  async getAccessToken(id: number) {
    const payload = {
      id
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret,
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '1Y',
      secret,
    });
    return {
      expires_in: 3600,
      access_token: token,
      refresh_token: refreshToken,
    };
  }
}
