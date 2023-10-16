import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSymptomTypeDto, symptomTypeDto } from './dto';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class IndicatorTypesService {
  constructor(private prisma: PrismaService, private awsService: AwsService) {}

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

  async createIndicatorType(dto: symptomTypeDto, icon) {
    try {
      const symptomType = await this.prisma.symptomType.create({
        data: {
          ...dto,
        },
      });
      if (icon) {
        return await this.updateIndicatorType(symptomType.id, dto, icon);
      }
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

  async updateIndicatorType(id: number, dto: UpdateSymptomTypeDto, icon) {
    try {
      let file = undefined;
      const data = {
        ...dto
      }

      if (icon) {
        file = await this.awsService.uploadFile(icon);
        data['icon_url'] = file.Location;
      }
      const symptomType = await this.prisma.symptomType.update({
        where: { id: +id },
        data,
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
