import { Injectable } from '@nestjs/common';
import { IndicatorTypesService } from 'src/indicatorTypes/indicatorTypes.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { IndicatorDto } from './dto';

@Injectable()
export class IndicatorsService {
  constructor(
    private prisma: PrismaService,
    private indicatorTypesService: IndicatorTypesService,
  ) {}

  async createIndicator(dto: IndicatorDto, reportId: number) {
    try {
      const indicatorValue = await this.buildIndicatorValue(
        dto.indicator_type_id,
        dto.value,
      );
      await this.prisma.indicator.create({
        data: {
          indicator_type: {
            connect: { id: dto.indicator_type_id },
          },
          report: {
            connect: { id: reportId },
          },
          value: {
            create: indicatorValue,
          },
        },
        include: {
          value: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateIndicator(dto: IndicatorDto) {
    try {
      const indicatorValue = await this.buildIndicatorValue(
        dto.indicator_type_id,
        dto.value,
      );

      await this.prisma.indicator.update({
        where: { id: dto.id },
        data: {
          value: {
            update: indicatorValue,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async buildIndicatorValue(indicatorId: number, indicatorValue: any) {
    try {
      const indicatorType =
        await this.indicatorTypesService.findOneIndicatorType(indicatorId);
      return {
        [indicatorType.unit_measure]: indicatorValue,
      };
    } catch (error) {
      throw error;
    }
  }
}
