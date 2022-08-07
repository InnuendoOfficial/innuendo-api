import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { indicatorTypeDto } from './dto';

@Injectable()
export class IndicatorTypesService {
  constructor(private prisma: PrismaService) {}

  async findAllIndicatorTypes() {
    try {
      const indicatorTypes = await this.prisma.indicatorType.findMany();
      return indicatorTypes;
    } catch (error) {
      throw error;
    }
  }

  async findOneIndicatorType(id: string) {
    try {
      const indicatorType = await this.prisma.indicatorType.findUnique({
        where: { id: +id },
      });
      return indicatorType;
    } catch (error) {
      throw error;
    }
  }

  async createIndicatorType(dto: indicatorTypeDto) {
    try {
      const indicatorType = await this.prisma.indicatorType.create({
        data: {
          ...dto,
        },
      });
      return indicatorType;
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

  async updateIndicatorType(id: string, dto: indicatorTypeDto) {
    try {
      const indicatorType = await this.prisma.indicatorType.update({
        where: { id: +id },
        data: { ...dto },
      });
      return indicatorType;
    } catch (error) {
      console.log(error);
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Record to update not found.');
      }
      throw error;
    }
  }
}
