import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { indicatorTypesDto } from './dto';

@Injectable()
export class IndicatorTypesService {
  constructor(private prisma: PrismaService) {}

  async findAllIndicatorTypes() {
    try {
      const indicators = await this.prisma.indicatorType.findMany();
      return indicators;
    } catch (error) {
      throw error;
    }
  }

  async findOneIndicatorType(id: string) {
    try {
      const indicators = await this.prisma.indicatorType.findUnique({
        where: { id: +id },
      });
      return indicators;
    } catch (error) {
      throw error;
    }
  }

  async createIndicatorType(dto: indicatorTypesDto) {
    try {
      const indicator = await this.prisma.indicatorType.create({
        data: {
          ...dto,
        },
      });
      return indicator;
    } catch (error) {
      throw error;
    }
  }

  async deleteIndicatorType(id: string) {
    try {
      await this.prisma.indicatorType.delete({
        where: { id: +id },
      });
      return { msg: `IndicatorType ${id} successfully deleted.` };
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
