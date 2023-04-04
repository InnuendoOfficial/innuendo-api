import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewsletterDto } from './dto';

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService, private mailService: MailService) {}

  async createProspect(dto: NewsletterDto) {
    try {
      await this.prisma.prospect.create({
        data: {
          email: dto['exemple-email.com'],
          name: dto.name,
          object: dto.Message,
        }
      });
      await this.mailService.sendNewsletterSubscription(dto.name, dto['exemple-email.com'], dto.Message);
    } catch (error) {
      throw error;
    }
  }

  async findAllProspect() {
    try {
      const prospects = await this.prisma.prospect.findMany();
      return prospects;
    } catch (error) {
      throw error;
    }
  }

  async DeleteProspect(id: number) {
    try {
      await this.prisma.prospect.delete({
        where: { id: id }
      })
      return { msg: `Prospect ${id} successfully deleted.` };
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
