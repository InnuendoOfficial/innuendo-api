import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { symptomTypeDto } from './dto';

@Injectable()
export class IndicatorTypesService {
  constructor(private prisma: PrismaService) {}

  async findAllIndicatorTypes() {
    try {
      const symptomTypes = await this.prisma.symptomType.findMany();
      return symptomTypes;
    } catch (error) {
      throw error;
    }
  }

  async findOneIndicatorType(id: number) {
    try {
      const symptomType = await this.prisma.symptomType.findUnique({
        where: { id: id },
      });
      if (!symptomType) {
        throw new NotFoundException(`SymptomType ${id} doesn't exist`);
      }
      return symptomType;
    } catch (error) {
      throw error;
    }
  }

  async createIndicatorType(dto: symptomTypeDto) {
    try {
      const symptomType = await this.prisma.symptomType.create({
        data: {
          ...dto,
        },
      });
      return symptomType;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('SymptomType provided is not valid.');
      }
      throw error;
    }
  }

  async deleteIndicatorType(id: string) {
    try {
      await this.prisma.symptomType.delete({
        where: { id: +id },
      });
      return { msg: `SymptomType ${id} successfully deleted.` };
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

  async updateIndicatorType(id: string, dto: symptomTypeDto) {
    try {
      const symptomType = await this.prisma.symptomType.update({
        where: { id: +id },
        data: { ...dto },
      });
      return symptomType;
    } catch (error) {
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
