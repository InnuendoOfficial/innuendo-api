import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { id: number }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (!user) {
      const pro = await this.prisma.pro.findUnique({
        where: {id: payload.id }
      })
      delete pro.hash;
      return pro;
    }
    delete user.hash;
    return user;
  }
}