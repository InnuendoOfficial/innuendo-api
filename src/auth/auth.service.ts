import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async userSignup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          lastname: dto.lastname,
          firstname: dto.firstname,
        },
      });
      delete user.hash;
      return this.getAccessToken(user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already taken');
        }
      }
      throw error;
    }
  }

  async userLogin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Incorrect email');
    if (!(await argon.verify(user.hash, dto.password)))
      throw new ForbiddenException('Incorrect password');
    delete user.hash;
    return this.getAccessToken(user.email);
  }

  async proSignup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const pro = await this.prisma.pro.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete pro.hash;
      return this.getAccessToken(pro.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already taken');
        }
      }
      throw error;
    }
  }

  async proLogin(dto: AuthDto) {
    const pro = await this.prisma.pro.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!pro) throw new ForbiddenException('Incorrect email');
    if (!(await argon.verify(pro.hash, dto.password)))
      throw new ForbiddenException('Incorrect password');
    delete pro.hash;
    return this.getAccessToken(pro.email);
  }

  async getAccessToken(email: string) {
    const payload = {
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret,
    });
    return {
      access_token: token,
    };
  }
}
